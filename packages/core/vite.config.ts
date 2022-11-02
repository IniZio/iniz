import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Iniz",
      formats: ["es", "cjs"],
      fileName: (format) => `[name].${format}.js`,
    },
    rollupOptions: {
      input: {
        index: "./src/index.ts",
        form: "./src/form/index.ts",
      },
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
        // By default chunk's filename will be the file will most code without format, causing different formats to overwrite each other.
        chunkFileNames: `chunk.[hash].[format].js`,
        inlineDynamicImports: false,
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
