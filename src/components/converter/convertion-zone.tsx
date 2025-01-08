"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "./file-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  FileVideo,
  ArrowRight,
  RotateCcw,
  Download,
  Settings2,
} from "lucide-react";
import { ConversionOptions } from "./conversion-options";
import { ProgressIndicator } from "./progress-indicator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ConversionStatus } from "@/types";
import { convertMedia } from "@/lib/media-converter";

interface DetectedFile {
  file: File;
  type: "video" | "image";
  preview?: string;
}

interface ConversionSettings {
  format: string;
  quality: number;
  preserveAudio?: boolean;
  resolution?: string;
  fps?: number;
}

const previewVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export function ConversionZone() {
  const [detectedFile, setDetectedFile] = useState<DetectedFile | null>(null);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [conversionSettings, setConversionSettings] =
    useState<ConversionSettings>({
      format: "mp4",
      quality: 80,
      preserveAudio: true,
      resolution: "1080p",
      fps: 30,
    });
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    const type = file.type.startsWith("video/") ? "video" : "image";
    const preview = URL.createObjectURL(file);
    setDetectedFile({ file, type, preview });
    setStatus("idle");
    setProgress(0);
    setConvertedUrl(null);
  };

  const handleConversion = async () => {
    setStatus("converting");
    setConvertedUrl(null);

    try {
      if (!detectedFile) return;

      const convertedBlob = await convertMedia(
        detectedFile.file,
        conversionSettings,
        (progress: number) => {
          setProgress(Math.round(progress));
        }
      );

      const url = URL.createObjectURL(convertedBlob);
      setConvertedUrl(url);
      setStatus("done");
      toast({
        title: "Conversion Complete! 🎉",
        description: "Your file has been successfully converted",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast({
        title: "Conversion Failed",
        description:
          "There was an error converting your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetState = () => {
    if (detectedFile?.preview) {
      URL.revokeObjectURL(detectedFile.preview);
    }
    setDetectedFile(null);
    setStatus("idle");
    setProgress(0);
    setConvertedUrl(null);
  };

  const handleDownload = () => {
    if (!convertedUrl) {
      toast({
        title: "Download Failed",
        description: "Converted file not found. Please try converting again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = convertedUrl;
      const extension = conversionSettings.format;
      const originalName = detectedFile?.file.name;
      const baseName =
        originalName?.split(".").slice(0, -1).join(".") || "converted";
      link.download = `${baseName}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description:
          "There was an error downloading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <AnimatePresence mode="wait">
        {!detectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <FileDropzone
              onFileSelect={handleFileSelect}
              accept={{
                "image/*": [],
                "video/*": [],
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 p-4 sm:p-6">
                {/* File Preview Section */}
                <motion.div
                  className="space-y-4 w-full"
                  variants={previewVariants}
                  initial="hidden"
                  animate="show"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden shadow-inner">
                    {detectedFile.type === "video" ? (
                      <video
                        src={detectedFile.preview}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={detectedFile.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                    {detectedFile.type === "video" ? (
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                        <FileVideo className="w-5 h-5 text-blue-500" />
                      </div>
                    ) : (
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-purple-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm sm:text-base">
                        {detectedFile.file.name}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm"
                        >
                          {detectedFile.type === "video" ? "Video" : "Image"}
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {(detectedFile.file.size / 1024 / 1024).toFixed(2)}MB
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Conversion Options Section */}
                <div className="space-y-4 sm:space-y-6 w-full">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Settings2 className="w-5 h-5 text-gray-500" />
                    <h3 className="font-medium text-sm sm:text-base">
                      Conversion Settings
                    </h3>
                  </div>

                  <ConversionOptions
                    type={detectedFile.type}
                    onOptionsChange={(newSettings) =>
                      setConversionSettings({
                        ...conversionSettings,
                        ...(newSettings as ConversionSettings),
                      })
                    }
                    defaultValues={conversionSettings}
                  />

                  {status !== "idle" && (
                    <ProgressIndicator status={status} progress={progress} />
                  )}

                  <div className="flex flex-wrap gap-3 pt-2 sm:pt-4">
                    {status === "done" ? (
                      <>
                        <Button
                          onClick={handleDownload}
                          className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full sm:w-auto"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetState}
                          className="gap-2 group w-full sm:w-auto"
                        >
                          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                          Convert Another
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleConversion}
                          disabled={status === "converting"}
                          className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto"
                        >
                          Convert Now
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetState}
                          className="gap-2 w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
