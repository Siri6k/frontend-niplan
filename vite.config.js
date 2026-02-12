import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite"; // <-- import du plugin Tailwind
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11", "Safari >= 12"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      modernPolyfills: true,
    }),
    react(),
    tailwindcss(), // ← ajoutez ce plugin
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: "es2015",
    outDir: "build", // même nom que CRA
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Si vous utilisez des alias comme `@/components`
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
