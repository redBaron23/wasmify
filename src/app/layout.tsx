import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wasmify - WebAssembly Image Processing",
  description:
    "Fast, secure, and efficient image conversion powered by Rust and WebAssembly. Convert images locally in your browser with near-native performance.",
  keywords:
    "WebAssembly, Rust, image processing, image conversion, web app, browser-based, privacy-first",
  openGraph: {
    title: "Wasmify - WebAssembly Image Processing",
    description:
      "Fast, secure, and efficient image conversion powered by Rust and WebAssembly",
    url: "https://wasmify.dev",
    siteName: "Wasmify",
    images: [
      {
        url: "/og-image.png", // Podrías usar una captura de pantalla de tu app
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
