import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";
// import { viteStaticCopy as copy } from 'vite-plugin-static-copy'

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
    react({
      jsxRuntime: "classic",
    }) as any,
    // copy({
    //   targets: [
    //     {
    //       src: 'dist/jsx-dev-runtime*',
    //       dest: '../jsx-dev-runtime/dist'
    //     },
    //     {
    //       src: 'dist/jsx-runtime*',
    //       dest: '../jsx-runtime/dist'
    //     }
    //   ]
    // })
  ],
});
