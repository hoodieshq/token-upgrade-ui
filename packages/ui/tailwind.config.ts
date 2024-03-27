import type { Config } from "tailwindcss"
import preset, {
  typographyStyles,
} from "token-upgrade-ui-shared/tailwind.config.ts"
import typographyPlugin from "@tailwindcss/typography"
import { blackA, violet } from "@radix-ui/colors"

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@radix-ui/**"
  ],
  preset: [preset],
  theme: {
    typography: typographyStyles,
    extend: {
      colors: () => ({
        ...blackA,
        ...violet,
      }),
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideIn: {
          from: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
        },
      },
      animation: {
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
      },
    },
  },
  plugins: [typographyPlugin],
} satisfies Config
