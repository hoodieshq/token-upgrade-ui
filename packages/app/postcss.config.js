module.exports = {
  plugins: {
    "postcss-import": {
      plugins: [require("postcss-discard-duplicates")],
    },
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
}
