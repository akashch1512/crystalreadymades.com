import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'https://crystal-readymade-production.up.railway.app',
    }
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
    host: '0.0.0.0',
    allowedHosts: [
      'www.crystalreadymades.com',
      'crystalreadymades.com'
    ]
  }
});
