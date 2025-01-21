import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

const root = path.resolve(__dirname, "./src/pages/");
const publicDir = path.resolve(__dirname, "public/");

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base : process.env.NODE_ENV === 'production' ? "portifolio" : "/",
  root,
  publicDir,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@pages": root,
    },
  },
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
        youtubeClone: path.join(root, "youtube-clone/", "index.html"),
      },
    },
  },
});
