import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Frontend → API PHP Ophtamax (php -S 127.0.0.1:8080 api/router.php)
      '/api': {
        target: 'http://127.0.0.1:8088',
        changeOrigin: true,
      },
    },
  },
})
