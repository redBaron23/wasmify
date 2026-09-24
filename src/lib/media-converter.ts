import wasmInit, { MediaConverter } from "@/wasm/media_converter";
import { decodeHeicToJpeg, isHeicFile } from "./heic-converter";

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

export async function convertImage(
  file: File,
  options: ConversionSettings,
  onProgress: (progress: number) => void
): Promise<Blob> {
  await initWasm();

  // HEIC/HEIF can't be decoded by the Rust `image` crate, so it's decoded
  // to JPEG in the browser first, then run through the normal pipeline.
  const sourceFile = isHeicFile(file) ? await decodeHeicToJpeg(file) : file;

  const arrayBuffer = await sourceFile.arrayBuffer();
  const inputData = new Uint8Array(arrayBuffer);

  const converter = new MediaConverter(options);
  converter.set_progress_callback((progress: number) => {
    onProgress(progress);
  });

  const result = converter.convert_image(inputData);

  return new Blob([result], {
    type: `image/${options.format}`,
  });
}
