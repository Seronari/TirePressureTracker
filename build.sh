#!/bin/bash
set -e

echo "Starting build process..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Build client
echo "Building client with Vite..."
./node_modules/.bin/vite build

# Build server
echo "Building server with ESBuild..."
./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18

echo "Build completed successfully!"