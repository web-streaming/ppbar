import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    watch: {
      cwd: process.cwd()
    }
  },
})
