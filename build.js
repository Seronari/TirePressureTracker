import { build } from 'vite';
import esbuild from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function buildProject() {
  try {
    console.log('Building client...');
    await build();
    
    console.log('Building server...');
    await esbuild.build({
      entryPoints: ['server/index.ts'],
      platform: 'node',
      packages: 'external',
      bundle: true,
      format: 'esm',
      outdir: 'dist',
      target: 'node18'
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProject();