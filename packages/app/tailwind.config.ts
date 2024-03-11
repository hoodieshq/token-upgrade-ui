import { Config } from "tailwindcss"
import tokenUpgradePreset from "token-upgrade-ui-shared/tailwind.config.ts"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [tokenUpgradePreset],
}

export default config
