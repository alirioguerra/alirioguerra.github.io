import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js', assetFileNames: 'main.css'
      },
      input: {
        main: './index.html',
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}) 