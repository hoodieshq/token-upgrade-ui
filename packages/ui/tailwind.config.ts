import type { Config } from "tailwindcss"
import tokenUpgradePreset from "token-upgrade-ui-shared/tailwind.config.ts"

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class"],
  preset: [tokenUpgradePreset],
} satisfies Config
