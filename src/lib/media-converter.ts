import init, { MediaConverter } from "@/wasm/media_converter";

let wasmModule: Awaited<ReturnType<typeof init>>;

export async function initWasm() {
  if (!wasmModule) {
    wasmModule = await init();
  }

  return wasmModule;
}

export type ConversionSettings = {
  format: string;
  quality: number;
  preserveAudio?: boolean;
  resolution?: string;
  fps?: number;
};

export async function convertMedia(
  file: File,
  options: ConversionSettings,
  onProgress: (progress: number) => void
): Promise<Blob> {
  await initWasm();

  const arrayBuffer = await file.arrayBuffer();
  const inputData = new Uint8Array(arrayBuffer);

  const converter = new MediaConverter(options);
  converter.set_progress_callback((progress: number) => {
    onProgress(progress);
  });

  const isVideo = file.type.startsWith("video/");
  const result = isVideo
    ? await converter.convert_video(inputData)
    : await converter.convert_image(inputData);

  return new Blob([result], {
    type: `${isVideo ? "video" : "image"}/${options.format}`,
  });
}
