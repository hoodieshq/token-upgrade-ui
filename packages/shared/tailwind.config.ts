import defaultTheme from "tailwindcss/defaultTheme"
import formsPlugin from "@tailwindcss/forms"
import headlessuiPlugin from "@headlessui/tailwindcss"
import type { Config } from "tailwindcss"
import type { PluginUtils } from "tailwindcss/types/config"

export function typographyStyles({ theme }: PluginUtils) {
  return {
    DEFAULT: {
      css: {
        "--tw-prose-body": theme("colors.zinc.700"),

        // Base
        color: "var(--tw-prose-body)",
        fontSize: theme("fontSize.sm")[0],
        lineHeight: theme("lineHeight.7"),

        // Overrides
        "> :first-child": {
          marginTop: "0 !important",
        },
        "> :last-child": {
          marginBottom: "0 !important",
        },
      },
    },
    invert: {
      css: {
        "--tw-prose-body": "var(--tw-prose-invert-body)",
      },
    },
  }
}

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      "2xs": ["0.75rem", { lineHeight: "1.25rem" }],
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "2rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["2rem", { lineHeight: "3rem" }],
      "4xl": ["2.5rem", { lineHeight: "3rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 4px rgb(0 0 0 / 0.1)",
      },
      colors: ({ colors }) => ({
        gray: colors.neutral,
      }),
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        lg: "33rem",
        "2xl": "40rem",
        "3xl": "50rem",
        "5xl": "66rem",
      },
      opacity: {
        1: "0.01",
        2.5: "0.025",
        7.5: "0.075",
        15: "0.15",
      },
    },
  },
  plugins: [formsPlugin, headlessuiPlugin],
} satisfies Config
