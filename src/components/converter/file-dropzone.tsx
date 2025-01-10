"use client";

import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

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
        "border-2 border-dashed rounded-lg p-12 transition-colors text-center",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25",
        "hover:border-primary hover:bg-primary/5"
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-muted-foreground">
        Drop your image file here, or click to select
      </p>
      <p className="text-sm text-muted-foreground/75 mt-1">
        Supports JPG, PNG, WebP, and GIF
      </p>
    </div>
  );
}
