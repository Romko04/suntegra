import { defineConfig } from "vite";
import viteImagemin from "vite-plugin-imagemin";
import VitePluginWebpAndPath from "vite-plugin-webp-and-path";
import { resolve } from "path";
import fontFacePlugin from "./fontFacePlugin";
import injectHTML from "vite-plugin-html-inject";
import { visualizer } from "rollup-plugin-visualizer";
import ViteProgress from "vite-plugin-progress";
import PluginCritical from "rollup-plugin-critical";

export default defineConfig({
  base: "./",
  server: {
    open: true,
    port: 3000,
    hot: true,
  },
  build: {
    outDir: "dist/assets",
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: "index.html",
        test: resolve(__dirname, "test/index.html"),
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) {
            return "css/[name][extname]";
          }
          if (name && /\.(png|jpe?g|webp|svg|gif)$/.test(name)) {
            return "images/[name][extname]";
          }

          if (name && /\.(woff|woff2|ttf|otf)$/.test(name)) {
            return "fonts/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
  plugins: [
    viteImagemin({
      optipng: { optimizationLevel: 5 },
      mozjpeg: { quality: 80 },
      webp: { quality: 80 },
    }),
    injectHTML(),
    VitePluginWebpAndPath(),
    fontFacePlugin(),
    visualizer({ open: false }),
    ViteProgress(),
    PluginCritical({
      criticalUrl: "./dist/assets/index.html",
      criticalBase: "./dist/assets/",
      criticalPages: [{ uri: "", template: "index" }],
      criticalConfig: {
        inline: true,
        extract: false,
        penthouse: {
          blockJSRequests: false,
        },
      },
    }),
  ],
});
