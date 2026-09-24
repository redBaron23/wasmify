const HEIC_MIME_TYPES = ["image/heic", "image/heif"];
const HEIC_EXTENSIONS = [".heic", ".heif"];

export function isHeicFile(file: File): boolean {
  if (HEIC_MIME_TYPES.includes(file.type.toLowerCase())) return true;
  const name = file.name.toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => name.endsWith(ext));
}

/**
 * HEIC/HEIF can't be decoded by the `image` crate, so we decode it to a JPEG
 * in the browser (via libheif compiled to WASM) before handing bytes to our
 * Rust converter, which then handles the requested output format.
 */
export async function decodeHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;

  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.95,
  });

  const blob = Array.isArray(result) ? result[0] : result;
  const baseName = file.name.replace(/\.(heic|heif)$/i, "");

  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
