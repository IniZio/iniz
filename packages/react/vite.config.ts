import typescript from "@rollup/plugin-typescript";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
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
        form: "./src/form/index.ts",
      },
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
        // By default chunk's filename will be the file will most code without format, causing different formats to overwrite each other.
        chunkFileNames: `chunk.[hash].[format].js`,
        inlineDynamicImports: false,
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
  plugins: [
    typescript({
      declaration: true,
      declarationDir: path.resolve(__dirname, "dist/types"),
    }),
    react({
      jsxRuntime: "classic",
    }) as any,
  ],
});
