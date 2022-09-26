import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife', 'esm', 'cjs'],
  target: 'es5',
  treeshake: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true
})