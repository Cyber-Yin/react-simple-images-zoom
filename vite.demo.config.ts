import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "demo"),
  base: "./",
  server: {
    port: 3000,
  },
  build: {
    outDir: path.resolve(__dirname, "demo/dist"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
