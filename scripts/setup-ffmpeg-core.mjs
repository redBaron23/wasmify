// Copies the ffmpeg.wasm single-threaded core (from the @ffmpeg/core package)
// into public/ffmpeg so it's served from our own origin instead of a CDN.
// It's ~30MB, so it's generated here rather than committed to the repo.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const coreDir = join(rootDir, "node_modules", "@ffmpeg", "core", "dist", "esm");
const ffmpegDir = join(rootDir, "node_modules", "@ffmpeg", "ffmpeg", "dist", "esm");
const outDir = join(rootDir, "public", "ffmpeg");

await mkdir(outDir, { recursive: true });

for (const file of ["ffmpeg-core.js", "ffmpeg-core.wasm"]) {
  await copyFile(join(coreDir, file), join(outDir, file));
}

// Served as-is (not bundled by webpack) and pointed to via `classWorkerURL`,
// otherwise Next.js/webpack statically rewrites this file's internal dynamic
// `import()` into a lookup that can never resolve a runtime blob: URL —
// see https://github.com/ffmpegwasm/ffmpeg.wasm/discussions/678
// worker.js imports these two sibling modules directly, so they need to be
// reachable at the same relative path once served from /ffmpeg.
for (const file of ["worker.js", "const.js", "errors.js"]) {
  await copyFile(join(ffmpegDir, file), join(outDir, file));
}

console.log(`ffmpeg core + worker copied to ${outDir}`);
