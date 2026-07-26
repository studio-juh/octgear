import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? "/octgear/" : "/",
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        index: "index.html",
        buildGuide: "build-guide.html",
        remapper: "remapper.html",
        diagnostics: "diagnostics.html",
      },
    },
  },
  plugins: [react()],
}));
