import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      // Add your ngrok URL here when using ngrok
      'unsplendid-ofelia-ponderously.ngrok-free.dev',
      // Example: 'your-ngrok-url.ngrok-free.app',
    ]
  }
})
