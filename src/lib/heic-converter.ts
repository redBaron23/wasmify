const HEIC_MIME_TYPES = ["image/heic", "image/heif"];
const HEIC_EXTENSIONS = [".heic", ".heif"];

function looksLikeHeicByName(file: File): boolean {
  const name = file.name.toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => name.endsWith(ext));
}

/**
 * Browsers are inconsistent about the MIME type they report for HEIC files
 * (often blank), so name/type hints are only used to decide whether it's
 * worth sniffing the file's actual magic bytes via heic-to's `isHeic`.
 */
export async function isHeicFile(file: File): Promise<boolean> {
  if (HEIC_MIME_TYPES.includes(file.type.toLowerCase())) return true;
  if (!looksLikeHeicByName(file) && file.type !== "") return false;

  const { isHeic } = await import("heic-to/next");
  try {
    return await isHeic(file);
  } catch {
    return looksLikeHeicByName(file);
  }
}

/**
 * HEIC/HEIF can't be decoded by the `image` crate, so it's decoded to a
 * JPEG in the browser (via libheif compiled to WASM, run in a worker) before
 * handing bytes to our Rust converter, which then handles the requested
 * output format.
 */
export async function decodeHeicToJpeg(file: File): Promise<File> {
  const { heicTo } = await import("heic-to/next");

  const blob = await heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.95,
  });

  const baseName = file.name.replace(/\.(heic|heif)$/i, "");

  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
