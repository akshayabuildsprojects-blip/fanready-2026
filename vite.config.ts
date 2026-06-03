import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { devDataPlugin } from "./vite-plugins/devDataPlugin.ts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devDataPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "src/data/*",
          dest: "data",
        },
      ],
    }),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["icons/icon-192x192.png", "icons/icon-512x512.png"],
      manifest: {
        name: "FanReady 2026",
        short_name: "FanReady",
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        background_color: undefined,
        theme_color: undefined,
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Skip terser minification of the generated SW (avoids flaky parallel renderChunk exits).
        mode: "development",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/data\//],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "fanready-static-data",
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "fanready-pages",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 8 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
