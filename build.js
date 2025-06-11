#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building frontend...');
try {
  execSync('vite build', { stdio: 'inherit' });
  console.log('Frontend build completed successfully');
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}

console.log('Copying server files...');
try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // Copy server files to dist
  fs.copyFileSync('server/index-simple.ts', 'dist/index-simple.js');
  
  console.log('Build completed successfully');
} catch (error) {
  console.error('Server copy failed:', error.message);
  process.exit(1);
}