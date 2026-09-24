"use client";

import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadCloud, ImageIcon, Film } from "lucide-react";

export function FileDropzone({
  onFileSelect,
  accept,
}: {
  onFileSelect: (file: File) => void;
  accept: Record<string, string[]>;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && onFileSelect(files[0]),
    accept,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group cursor-pointer border-2 border-dashed rounded-2xl p-10 sm:p-16 transition-all text-center bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-muted-foreground/25",
        "hover:border-primary hover:bg-primary/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
        <UploadCloud className="h-8 w-8 text-white" />
      </div>
      <p className="mt-5 text-base sm:text-lg font-medium">
        {isDragActive ? "Drop it right here" : "Drag & drop a file, or click to browse"}
      </p>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
        One file at a time, converted entirely on your device — nothing is
        uploaded anywhere.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          JPG · PNG · WebP · GIF · HEIC
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5" />
          MP4 · WebM · MOV
        </span>
      </div>
    </div>
  );
}
