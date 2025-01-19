import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import { viteStaticCopy } from "vite-plugin-static-copy";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/*",
          dest: ".",
        },
      ],
    }),
    eslint(),
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: function customJsAssetsfilterFunction(
        outputChunk
      ) {
        return new Set(["popup.js"]).has(outputChunk.fileName);
      },
    }),
  ],

  build: {
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/Popup.tsx"),
        background: resolve(__dirname, "src/background/Background.ts"),
        clipper: resolve(__dirname, "src/contentScripts/Clipper.ts"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${resolve(__dirname, "src/popup/style/Main.scss")}";`,
      },
    },
  },

  server: {
    port: 3000,
    open: "/index.html",
    fs: {
      allow: ["../dist"], // Serve files from dist directory
    },
  },

  esbuild: {
    loader: "tsx",
  },
});
