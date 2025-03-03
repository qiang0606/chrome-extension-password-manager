import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import copy from "rollup-plugin-copy";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isWeb = mode === "web";

  const config = {
    plugins: [
      vue(),
      copy({
        targets: [
          { src: "src/manifest.json", dest: "dist" },
          { src: "src/icons", dest: "dist" },
          {
            src: isWeb ? null : "index.html",
            dest: "dist",
            transform: (contents) =>
              contents.toString().replace("/src/main.js", "popup.js"),
            rename: "popup.html",
          },
        ].filter(Boolean),
        hook: "writeBundle",
        verbose: true,
      }),
    ],
    build: {
      // minify: false,
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          ...(isWeb ? { app: resolve(__dirname, "index.html") } : {}),
          popup: resolve(__dirname, "src/main.js"),
          content: resolve(__dirname, "src/content.js"),
          background: resolve(__dirname, "src/background.js"),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].[hash].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    server: {
      port: 4173,
      open: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };

  return config;
});
