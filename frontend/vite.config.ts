import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'https://crystal-readymade-production.up.railway.app', // point to your Express backend
    }
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
    host: '0.0.0.0',
  }
});
