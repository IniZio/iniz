import path from "path";
import { defineConfig } from "vitest/config";
// NOTE: Apparently vitest is not compatitable with react plugin for now...?
// import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ReactIniz",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external(id) {
        return ["react"].includes(id.split("/")[0]);
      },
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "istanbul",
    },
  },
  plugins: [],
});
