import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  clean: true,
  dts: true,
  format: "esm",
  minify: options?.env?.NODE_ENV === "production" ? true : undefined,
  sourcemap: Boolean(options.watch),
  splitting: true,
  target: "esnext",
  entry: {
    "index.esm": "./src/index.ts",
  },
  esbuildOptions(options) {
    options.external = ["react", "buffer", "@solana/*"]
  },
}))
