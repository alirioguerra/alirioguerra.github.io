import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: './dist',
    rollupOptions: {
      input: 'js/main.js',
      output: {
        entryFileNames: 'index.min.js',
        format: 'iife',
        name: 'main'
      }
    }
  },

}) 