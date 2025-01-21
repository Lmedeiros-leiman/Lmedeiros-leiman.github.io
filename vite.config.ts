import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

const root = path.resolve(__dirname, "./src/pages");
const publicDir = path.resolve(__dirname, "public");

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  root,
  publicDir,
  build: {
    target: "esnext",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        dir: path.resolve(__dirname, "build"),
      },
      input: {
        home: path.join(root, "index.html"),
        blog: path.join(root,"blog","/index.html"),
        youtubeClone: path.join(root, "youtube-clone", "/index.html"),
      },
    },
  },
});
