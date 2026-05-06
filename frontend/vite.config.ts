import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['Logo/Hero_Logo.png'],
        manifest: {
          name: 'CrystalReadymade',
          short_name: 'CrystalApp',
          description: 'Luxury crystal products store',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'Logo/Hero_Logo.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'Logo/Hero_Logo.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: Number(process.env.PORT) || 4173,
      host: '0.0.0.0',
      allowedHosts: [
        'www.crystalreadymades.com',
        'crystalreadymades.com',
      ],
    },
  };
});
