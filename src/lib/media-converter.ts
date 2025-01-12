import wasmInit, { MediaConverter } from "@/wasm/media_converter";

const wasmURL = new URL("@/wasm/media_converter_bg.wasm", import.meta.url);

let wasmModule: Awaited<ReturnType<typeof wasmInit>>;

export async function initWasm() {
  try {
    if (!wasmModule) {
      wasmModule = await wasmInit(wasmURL);
    }
    return wasmModule;
  } catch (error) {
    console.error("Error initializing WASM:", error);
    throw new Error("Failed to initialize WASM module");
  }
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
