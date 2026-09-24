import type { FFmpeg } from "@ffmpeg/ffmpeg";

const CORE_VERSION = "0.12.6";
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export async function initFFmpeg(
  onLog?: (message: string) => void
): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();

    if (onLog) {
      ffmpeg.on("log", ({ message }) => onLog(message));
    }

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${CORE_BASE_URL}/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${CORE_BASE_URL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  try {
    return await loadPromise;
  } catch (error) {
    loadPromise = null;
    throw error;
  }
}

export type VideoConversionSettings = {
  format: string;
  quality: number;
  preserveAudio?: boolean;
  resolution?: string;
  fps?: number;
};

const RESOLUTION_HEIGHTS: Record<string, number> = {
  "2160p": 2160,
  "1440p": 1440,
  "1080p": 1080,
  "720p": 720,
  "480p": 480,
};

const VIDEO_CODECS: Record<string, string[]> = {
  mp4: ["-c:v", "libx264", "-pix_fmt", "yuv420p"],
  webm: ["-c:v", "libvpx-vp9"],
  mov: ["-c:v", "libx264", "-pix_fmt", "yuv420p"],
};

const MIME_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

// Map a 0-100 "quality" slider onto each codec's own quality scale.
function qualityToCrf(format: string, quality: number): string {
  const min = format === "webm" ? 20 : 18; // best quality
  const max = format === "webm" ? 45 : 32; // worst quality
  const crf = Math.round(max - (quality / 100) * (max - min));
  return String(crf);
}

export async function convertVideo(
  file: File,
  options: VideoConversionSettings,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await initFFmpeg();
  onProgress(5);

  const inputExt = file.name.split(".").pop() || "mp4";
  const inputFile = `input.${inputExt}`;
  const outputFormat = options.format in MIME_TYPES ? options.format : "mp4";
  const outputFile = `output.${outputFormat}`;

  const { fetchFile } = await import("@ffmpeg/util");
  await ffmpeg.writeFile(inputFile, await fetchFile(file));
  onProgress(15);

  const progressHandler = ({ progress }: { progress: number }) => {
    const clamped = Math.min(Math.max(progress, 0), 1);
    onProgress(15 + Math.round(clamped * 80));
  };
  ffmpeg.on("progress", progressHandler);

  const args = ["-i", inputFile];

  const targetHeight = RESOLUTION_HEIGHTS[options.resolution || ""];
  if (targetHeight) {
    args.push("-vf", `scale=-2:${Math.min(targetHeight, 2160)}`);
  }

  if (options.fps) {
    args.push("-r", String(options.fps));
  }

  args.push(...(VIDEO_CODECS[outputFormat] || VIDEO_CODECS.mp4));
  args.push("-crf", qualityToCrf(outputFormat, options.quality));

  if (options.preserveAudio === false) {
    args.push("-an");
  } else {
    args.push("-c:a", outputFormat === "webm" ? "libopus" : "aac");
  }

  args.push(outputFile);

  try {
    await ffmpeg.exec(args);
  } finally {
    ffmpeg.off("progress", progressHandler);
  }

  const data = await ffmpeg.readFile(outputFile);
  const bytes =
    data instanceof Uint8Array ? data : new TextEncoder().encode(data);

  await ffmpeg.deleteFile(inputFile);
  await ffmpeg.deleteFile(outputFile);

  onProgress(100);

  return new Blob([bytes], { type: MIME_TYPES[outputFormat] });
}
