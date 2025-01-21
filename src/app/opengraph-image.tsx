import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Wasmify - WebAssembly Image Processing";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to right, #2563EB, #9333EA)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Puedes usar tu logo aquí */}
          <div style={{ fontSize: "48px", color: "#2563EB" }}>W</div>
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Wasmify
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "white",
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Fast, secure, and efficient image processing
          <br />
          powered by WebAssembly
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
