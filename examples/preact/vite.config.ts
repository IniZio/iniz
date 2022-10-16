import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  // Still waiting for https://github.com/preactjs/preset-vite/pull/47
  plugins: [preact()],
});
