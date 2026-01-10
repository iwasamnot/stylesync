import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg'],
      workbox: {
        // Optimize caching strategy
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/via\.placeholder\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'placeholder-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:js|css|html)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
        // Skip waiting for better performance
        skipWaiting: true,
        clientsClaim: true,
        // Clean up old caches
        cleanupOutdatedCaches: true,
        // Navigation preload for faster page loads
        navigationPreload: true,
      },
      manifest: {
        name: 'StyleSync',
        short_name: 'StyleSync',
        description: 'StyleSync clothing e-commerce app',
        theme_color: '#111827',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
        // Performance hints
        related_applications: [],
        prefer_related_applications: false,
      },
    }),
  ],
  build: {
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // Firebase vendor chunk
          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor';
          }
          // Framer Motion chunk
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          // Only include stripe if it's actually used (not empty)
          if (id.includes('node_modules/@stripe/stripe-js') && id.includes('stripe')) {
            return 'stripe';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize asset names for better caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Minify with terser for better performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // Source maps for debugging (disabled in production for performance)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
  },
  // Optimize dev server
  server: {
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
    exclude: ['@stripe/stripe-js'], // Exclude from pre-bundling as it's loaded on-demand
  },
})

