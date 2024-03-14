import type { Config } from "tailwindcss"
import preset, { typographyStyles } from "token-upgrade-ui-shared/tailwind.config.ts"
import typographyPlugin from '@tailwindcss/typography'

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  preset: [preset],
  theme: {
    typography: typographyStyles,
  },
  plugins: [typographyPlugin]
} satisfies Config
