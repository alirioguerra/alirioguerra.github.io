import { defineConfig } from 'vite'

export default defineConfig({
  base: '/alirioguerra.github.io/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        resume: './resume.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}) 