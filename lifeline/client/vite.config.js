import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://lifeline-production-4df8.up.railway.app',
        changeOrigin: true
      }
    }
  }
})
