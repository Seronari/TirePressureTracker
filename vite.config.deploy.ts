import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false, // Disable minification to speed up build
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [
        // Externalize heavy dependencies that can be loaded from CDN
        'lucide-react'
      ],
      output: {
        globals: {
          'lucide-react': 'LucideReact'
        },
        manualChunks: {
          // Create smaller chunks
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
        }
      }
    },
    target: 'es2020',
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    }
  },
  esbuild: {
    target: 'es2020'
  }
})