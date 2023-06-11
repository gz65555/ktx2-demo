import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    dedupe: ["@galacean/engine"],
  },
  optimizeDeps: {
    exclude: [
      "@galacean/engine",
      "@galacean/engine-core",
      "@galacean/engine-math",
      "@galacean/engine-loader",
      "@galacean/engine-lottie",
      "@galacean/tools-baker",
      "@galacean/engine-toolkit",
      "@galacean/engine-toolkit-auxiliary-lines",
      "@galacean/engine-toolkit-framebuffer-picker",
      "@galacean/engine-toolkit-controls",
      "@galacean/engine-toolkit-gizmo",
      "@galacean/engine-toolkit-lines",
      "@galacean/engine-toolkit-outline",
      "@galacean/engine-toolkit-custom-material",
      "@galacean/engine-toolkit-geometry-sketch",
      "@galacean/engine-toolkit-navigation-gizmo",
      "@galacean/engine-toolkit-skeleton-viewer",
      "@galacean/engine-toolkit-stats",
    ],
  },
});
