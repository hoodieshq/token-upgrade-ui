import { Config } from "tailwindcss"
import preset, {
  typographyStyles,
} from "token-upgrade-ui-shared/tailwind.config.ts"
import typographyPlugin from "@tailwindcss/typography"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@solana/token-upgrade-ui/lib/index.esm.css",
  ],
  presets: [preset],
  theme: {
    typography: typographyStyles,
  },
  plugins: [typographyPlugin],
} satisfies Config

export default config
