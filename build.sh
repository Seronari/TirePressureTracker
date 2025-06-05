#!/bin/bash
set -e

echo "Starting build process..."

# Build client
echo "Building client with Vite..."
npx vite build

# Build server
echo "Building server with ESBuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18

echo "Build completed successfully!"