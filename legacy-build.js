const { spawn } = require('child_process');
const { join } = require('path');
const fs = require('fs');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: __dirname,
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function legacyBuild() {
  try {
    console.log('Starting legacy build for older Node.js...');
    
    // Create dist directory
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    
    // Copy client files to dist
    console.log('Copying client files...');
    if (fs.existsSync('client/index.html')) {
      fs.copyFileSync('client/index.html', 'dist/index.html');
    }
    
    // Copy public directory if it exists
    if (fs.existsSync('client/public')) {
      const copyRecursiveSync = (src, dest) => {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
          }
          fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      };
      copyRecursiveSync('client/public', 'dist');
    }
    
    // Use node directly to run esbuild for server
    console.log('Building server with legacy Node.js...');
    await runCommand('node', [
      '-e',
      `
      const esbuild = require('esbuild');
      esbuild.build({
        entryPoints: ['server/index.ts'],
        bundle: true,
        platform: 'node',
        target: 'node12',
        format: 'cjs',
        outfile: 'dist/server.js',
        external: ['express', 'ws'],
        minify: false,
        allowOverwrite: true
      }).then(() => {
        console.log('Server build completed');
      }).catch((error) => {
        console.error('Server build failed:', error);
        process.exit(1);
      });
      `
    ]);
    
    console.log('Legacy build completed successfully!');
    
  } catch (error) {
    console.error('Legacy build failed:', error.message);
    process.exit(1);
  }
}

legacyBuild();