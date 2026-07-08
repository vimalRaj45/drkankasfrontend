import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/check-user': 'http://localhost:3000',
      '/create-user': 'http://localhost:3000',
      '/book': 'http://localhost:3000',
      '/appointments': 'http://localhost:3000',
      '/update-status': 'http://localhost:3000',
      '/my-appointments': 'http://localhost:3000',
      '/subscribe': 'http://localhost:3000',
      '/feedback': 'http://localhost:3000',
      '/broadcast-push': 'http://localhost:3000',
      '/public-stats': 'http://localhost:3000',
      '/settings': 'http://localhost:3000',
    },
  },
})
