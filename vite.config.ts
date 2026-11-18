import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'oyna-oqy',
        short_name: 'oyna-oqy',
        description: 'Балаларға арналған дамытушы ойындар / Развивающие игры для детей',
        lang: 'kk',
        theme_color: '#FFB547',
        background_color: '#FFF8EC',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Всё лёгкое (код, SVG-картинки, иконки) кладём в кэш сразу,
        // аудио — лениво, при первом проигрывании.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,webmanifest}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/audio/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio',
              expiration: { maxEntries: 400 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/img/'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'images' },
          },
        ],
      },
    }),
  ],
})
