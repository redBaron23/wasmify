# Wasmify - WebAssembly Image Processing

A modern web application that leverages WebAssembly for high-performance image processing, built with Next.js 15 and Rust.

## Features

- Browser-based image processing using WebAssembly
- Modern UI built with shadcn/ui components
- Dark/Light theme support
- Drag and drop file uploads
- Real-time image processing preview

## Tech Stack

- Next.js 15
- Rust (WebAssembly)
- shadcn/ui components
- TailwindCSS
- TypeScript
- Framer Motion for animations

## Prerequisites

Make sure you have the following installed:
- Node.js (Latest LTS version recommended)
- pnpm
- Rust and wasm-pack (for WebAssembly compilation)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd wasmify
```

2. Install dependencies

```bash
pnpm install
```

3. Build the WebAssembly module and start the development server:

```bash
pnpm dev
```
This will:
- Build the Rust code to WebAssembly
- Start the Next.js development server

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Development Scripts

- `pnpm dev` - Build WebAssembly and start development server
- `pnpm wasm-build` - Build WebAssembly module only
- `pnpm vercel-build` - Build for production deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[License Type] - See LICENSE file for details

## Deployment

The application is configured for deployment on Vercel. You can deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/redBaron23/wasmify)
