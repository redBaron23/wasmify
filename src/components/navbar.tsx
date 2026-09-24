"use client";

import { Github } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Image
              src="/icon.png"
              alt="Wasmify logo"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>
          <span className="font-semibold tracking-tight">Wasmify</span>
        </a>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#formats" className="hover:text-foreground transition-colors">
            Formats
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a
            href="#conversion-zone"
            className="hover:text-foreground transition-colors"
          >
            Convert
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a
            href="https://github.com/redBaron23/wasmify"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="View source on GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
