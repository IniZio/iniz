import preact from "@preact/preset-vite";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ReactIniz",
      formats: ["es", "cjs"],
      fileName: (format) => `[name].${format}.js`,
    },
    rollupOptions: {
      input: {
        index: "./src/index.ts",
        "jsx-runtime": "./src/jsx-runtime.ts",
        "jsx-dev-runtime": "./src/jsx-dev-runtime.ts",
      },
      external(id) {
        return ["preact"].includes(id.split("/")[0]);
      },
      output: {
        globals: {
          preact: "Preact",
        },
        inlineDynamicImports: false,
      },
    },
  },
  esbuild: {
    jsx: "automatic",
  },
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "istanbul",
    },
  },
  plugins: [preact()],
});
