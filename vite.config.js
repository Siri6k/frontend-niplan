import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite"; // <-- import du plugin Tailwind

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← ajoutez ce plugin
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
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
