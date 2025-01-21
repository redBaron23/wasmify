import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Wasmify - WebAssembly Image Processing";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#2563EB",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "128px",
            fontWeight: "bold",
          }}
        >
          Wasmify
        </div>
      </div>
    ),
    size
  );
}
