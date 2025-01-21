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
    "Fast, secure, and efficient image conversion powered by Rust and WebAssembly",
  icons: {
    icon: [
      {
        url: "/icon/icon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/icon/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    shortcut: ["/icon/favicon.ico"],
  },
  manifest: "/icon/site.webmanifest",
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
