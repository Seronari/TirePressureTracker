#!/usr/bin/env node

import { build } from 'esbuild';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Copy directory recursively
function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const files = readdirSync(src);
  for (const file of files) {
    const srcPath = join(src, file);
    const destPath = join(dest, file);
    
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

async function quickBuild() {
  try {
    console.log('Starting quick build...');
    
    // Create dist directory
    if (!existsSync('dist')) {
      mkdirSync('dist', { recursive: true });
    }
    
    // Copy static files
    console.log('Copying static files...');
    copyFileSync('client/index.html', 'dist/index.html');
    
    if (existsSync('client/public')) {
      copyDir('client/public', 'dist');
    }
    
    // Build server only
    console.log('Building server...');
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: 'dist/server.js',
      external: ['express', 'ws', '@neondatabase/serverless'],
      minify: false,
      sourcemap: false
    });
    
    console.log('Quick build completed! Server-only deployment ready.');
    console.log('Note: This creates a server-only build. For full production, use the regular build process.');
    
  } catch (error) {
    console.error('Quick build failed:', error);
    process.exit(1);
  }
}

quickBuild();