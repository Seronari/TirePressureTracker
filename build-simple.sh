#!/bin/bash

echo "Starting simple build process..."

# Build frontend only
echo "Building frontend with Vite..."
npx vite build

if [ $? -eq 0 ]; then
    echo "Frontend build completed successfully"
    
    # Create simple server structure
    echo "Setting up server files..."
    mkdir -p dist/server
    
    # Copy the simple server file
    cp server/index-simple.ts dist/server/
    
    echo "Build process completed successfully"
    exit 0
else
    echo "Build failed"
    exit 1
fi