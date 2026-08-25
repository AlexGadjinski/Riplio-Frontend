import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // всичко, което почва с /api, се препраща към Spring бекенда
      '/api': 'http://localhost:8080'
    }
  }
})
