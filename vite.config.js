import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        main: 'js/main.js',
        performance: 'js/performance.js',
        scrollConfig: 'js/scroll-config.js'
      },
      output: {
        entryFileNames: '[name].min.js',
        format: 'iife',
        name: 'main'
      }
    }
  },
  optimizeDeps: {
    include: ['locomotive-scroll']
  }
}) 