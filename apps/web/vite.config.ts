import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? "/octgear/" : "/",
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        index: "index.html",
        octgear: "octgear.html",
        octgearRemapper: "octgear-remapper.html",
        octgearDiagnostics: "octgear-diagnostics.html",
      },
    },
  },
  plugins: [react()],
}));
