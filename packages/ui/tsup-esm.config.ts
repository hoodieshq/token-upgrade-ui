import { defineConfig } from "tsup"

export default defineConfig(() => ({
  dts: true,
  format: "esm",
  sourcemap: true,
  splitting: true,
  target: "esnext",
  entry: {
    "index.esm": "./src/index.ts",
  },
}))
