import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Isso resolve o conflito de localhost/127.0.0.1 de uma vez por todas
    port: 5173,
    strictPort: true
  }
})