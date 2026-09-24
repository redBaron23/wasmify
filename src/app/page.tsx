"use client";

import { ConversionZone } from "@/components/converter/convertion-zone";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Zap,
  Shield,
  FileType,
  Film,
  Upload,
  SlidersHorizontal,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Convert images and videos at native speed with WebAssembly technology",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "Everything runs locally in your browser — files never leave your device",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileType,
    title: "HEIC Ready",
    description:
      "Drop iPhone HEIC photos and export them straight to JPG, PNG, or WebP",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Film,
    title: "Video Conversion",
    description:
      "Transcode MP4, WebM, and MOV with control over resolution, FPS, and audio",
    color: "from-emerald-500 to-teal-500",
  },
];

const steps = [
  {
    icon: Upload,
    title: "Add your file",
    description: "Drag & drop or browse for an image or video.",
  },
  {
    icon: SlidersHorizontal,
    title: "Pick your settings",
    description: "Choose the output format, quality, and (for video) resolution & FPS.",
  },
  {
    icon: Download,
    title: "Convert & download",
    description: "Everything happens on your device — grab the result instantly.",
  },
];

const formatGroups = [
  {
    label: "Images in",
    formats: ["JPG", "PNG", "WebP", "GIF", "HEIC"],
  },
  {
    label: "Images out",
    formats: ["JPG", "PNG", "WebP", "GIF"],
  },
  {
    label: "Video in & out",
    formats: ["MP4", "WebM", "MOV"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <Navbar />

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-slate-50/[0.9] dark:bg-slate-950/[0.9]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-gradient-to-br from-red-500/20 to-yellow-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <main className="relative container mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="flex justify-center mb-2">
            <Badge
              variant="secondary"
              className="gap-1.5 px-3 py-1 text-xs font-medium bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-gray-800 text-muted-foreground"
            >
              <Image src="/icon.png" alt="" width={14} height={14} />
              Now with HEIC & video support
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Convert images & videos with WebAssembly
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Fast, private, and free. Drop a photo (even HEIC from your
            iPhone) or a video, pick a format, and download the result —
            nothing ever leaves your browser.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <a href="#conversion-zone">Get Started</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/redBaron23/wasmify"
                target="_blank"
                rel="noopener"
                className="group"
              >
                <Github className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative h-full"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              <div className="relative h-full p-6 rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 flex flex-col">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} w-fit`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 grow text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Supported Formats */}
        <motion.div
          id="formats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-blue-500/5">
            <h2 className="text-lg font-semibold text-center mb-6">
              Supported formats
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {formatGroups.map((group) => (
                <div key={group.label} className="text-center space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {group.formats.map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          id="how-it-works"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-center mb-10">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow-lg shadow-blue-500/20">
                  {index + 1}
                </div>
                <step.icon className="w-5 h-5 mx-auto text-muted-foreground" />
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversion Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ConversionZone />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative mt-24 py-8 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Built with <span className="text-red-500">❤️</span> using Next.js,
            Rust, and WebAssembly by{" "}
            <a
              href="https://patriciotoledo.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 font-medium hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
            >
              @redBaron23
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
