import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11", "Safari >= 12"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      modernPolyfills: true,
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: false, // On utilise public/manifest.webmanifest manuellement
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,woff2,woff,ttf,webmanifest}",
        ],
        globDirectory: "build",
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 Mo max par fichier
        runtimeCaching: [
          {
            // Images produits : Cache First (économise la data)
            urlPattern: /^https:\/\/.*\.(jpg|jpeg|png|webp|avif|gif)/i,
            handler: "CacheFirst",
            options: {
              cacheName: "niplan-images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // API backend : Network First avec fallback rapide
            urlPattern: /^https:\/\/api\.niplan\.cd\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "niplan-api",
              networkTimeoutSeconds: 3, // Timeout agressif pour 3G
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 jour
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Fonts & CDN : Cache long (ne change jamais)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "niplan-fonts",
              expiration: {
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Uploads / médias utilisateurs
            urlPattern: /^https:\/\/cdn\.niplan\.cd\/.*\.(jpg|jpeg|png|webp)/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "niplan-uploads",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Activer en dev pour tester le SW
        type: "module",
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: "es2015",
    outDir: "build",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["lucide-react", "clsx", "tailwind-merge"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
