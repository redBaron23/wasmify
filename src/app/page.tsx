"use client";

import { ConversionZone } from "@/components/converter/convertion-zone";
import { Button } from "@/components/ui/button";
import { Github, Zap, Shield, FileType, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Convert images at native speed with WebAssembly technology",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "All processing happens locally in your browser",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileType,
    title: "Multiple Formats",
    description: "Support for PNG, JPEG, WebP, and GIF formats",
    color: "from-purple-500 to-pink-500",
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
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-slate-50/[0.9]" />
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
          <div className="flex justify-center mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
              <Image
                src="/icon.png"
                alt="Wasmify logo"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Convert your images with WebAssembly
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fast, secure, and efficient image conversion powered by Rust and
            WebAssembly
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
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative h-full"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              <div className="relative h-full p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 flex flex-col">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} w-fit`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="text-gray-600 mt-2 grow">{feature.description}</p>
              </div>
            </motion.div>
          ))}
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
      <footer className="relative mt-24 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
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
