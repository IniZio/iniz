import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Iniz",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
    },
  },
  plugins: [],
});
