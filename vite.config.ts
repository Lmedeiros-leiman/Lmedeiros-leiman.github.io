import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

const root = "./src/pages/";
// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  root,
  build: {
    target: "esnext",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        dir: "build",
      },
      input: {
        home: path.join(root, "index.html"),
        youtubeClone: path.join(root, "youtube-clone", "/index.html"),
      },
    },
  },
});
