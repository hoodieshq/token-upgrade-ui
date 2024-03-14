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
        "--tw-prose-headings": theme("colors.zinc.900"),
        "--tw-prose-links": theme("colors.emerald.500"),
        "--tw-prose-links-hover": theme("colors.emerald.600"),
        "--tw-prose-links-underline": theme("colors.emerald.500 / 0.3"),
        "--tw-prose-bold": theme("colors.zinc.900"),
        "--tw-prose-counters": theme("colors.zinc.500"),
        "--tw-prose-bullets": theme("colors.zinc.300"),
        "--tw-prose-hr": theme("colors.zinc.900 / 0.05"),
        "--tw-prose-quotes": theme("colors.zinc.900"),
        "--tw-prose-quote-borders": theme("colors.zinc.200"),
        "--tw-prose-captions": theme("colors.zinc.500"),
        "--tw-prose-code": theme("colors.zinc.900"),
        "--tw-prose-code-bg": theme("colors.zinc.100"),
        "--tw-prose-code-ring": theme("colors.zinc.300"),
        "--tw-prose-th-borders": theme("colors.zinc.300"),
        "--tw-prose-td-borders": theme("colors.zinc.200"),

        "--tw-prose-invert-body": theme("colors.zinc.400"),
        "--tw-prose-invert-headings": theme("colors.white"),
        "--tw-prose-invert-links": theme("colors.emerald.400"),
        "--tw-prose-invert-links-hover": theme("colors.emerald.500"),
        "--tw-prose-invert-links-underline": theme("colors.emerald.500 / 0.3"),
        "--tw-prose-invert-bold": theme("colors.white"),
        "--tw-prose-invert-counters": theme("colors.zinc.400"),
        "--tw-prose-invert-bullets": theme("colors.zinc.600"),
        "--tw-prose-invert-hr": theme("colors.white / 0.05"),
        "--tw-prose-invert-quotes": theme("colors.zinc.100"),
        "--tw-prose-invert-quote-borders": theme("colors.zinc.700"),
        "--tw-prose-invert-captions": theme("colors.zinc.400"),
        "--tw-prose-invert-code": theme("colors.white"),
        "--tw-prose-invert-code-bg": theme("colors.zinc.700 / 0.15"),
        "--tw-prose-invert-code-ring": theme("colors.white / 0.1"),
        "--tw-prose-invert-th-borders": theme("colors.zinc.600"),
        "--tw-prose-invert-td-borders": theme("colors.zinc.700"),

        // Base
        color: "var(--tw-prose-body)",
        fontSize: theme("fontSize.sm")[0],
        lineHeight: theme("lineHeight.7"),

        // Text
        p: {
          marginTop: theme("spacing.6"),
          marginBottom: theme("spacing.6"),
        },
        '[class~="lead"]': {
          fontSize: theme("fontSize.base")[0],
          ...theme("fontSize.base")[1],
        },

        // Horizontal rules
        hr: {
          borderColor: "var(--tw-prose-hr)",
          borderTopWidth: 1,
          marginTop: theme("spacing.16"),
          marginBottom: theme("spacing.16"),
          maxWidth: "none",
          marginLeft: `calc(-1 * ${theme("spacing.4")})`,
          marginRight: `calc(-1 * ${theme("spacing.4")})`,
          "@screen sm": {
            marginLeft: `calc(-1 * ${theme("spacing.6")})`,
            marginRight: `calc(-1 * ${theme("spacing.6")})`,
          },
          "@screen lg": {
            marginLeft: `calc(-1 * ${theme("spacing.8")})`,
            marginRight: `calc(-1 * ${theme("spacing.8")})`,
          },
        },

        // Headings
        h1: {
          color: "var(--tw-prose-headings)",
          fontWeight: "700",
          fontSize: theme("fontSize.2xl")[0],
          ...theme("fontSize.2xl")[1],
          marginBottom: theme("spacing.2"),
        },
        h2: {
          color: "var(--tw-prose-headings)",
          fontWeight: "600",
          fontSize: theme("fontSize.lg")[0],
          ...theme("fontSize.lg")[1],
          marginTop: theme("spacing.16"),
          marginBottom: theme("spacing.2"),
        },
        h3: {
          color: "var(--tw-prose-headings)",
          fontSize: theme("fontSize.base")[0],
          ...theme("fontSize.base")[1],
          fontWeight: "600",
          marginTop: theme("spacing.10"),
          marginBottom: theme("spacing.2"),
        },

        // Media
        "img, video, figure": {
          marginTop: theme("spacing.8"),
          marginBottom: theme("spacing.8"),
        },
        "figure > *": {
          marginTop: "0",
          marginBottom: "0",
        },
        figcaption: {
          color: "var(--tw-prose-captions)",
          fontSize: theme("fontSize.xs")[0],
          ...theme("fontSize.xs")[1],
          marginTop: theme("spacing.2"),
        },

        // Inline elements
        a: {
          color: "var(--tw-prose-links)",
          textDecoration: "underline transparent",
          fontWeight: "500",
          transitionProperty: "color, text-decoration-color",
          transitionDuration: theme("transitionDuration.DEFAULT"),
          transitionTimingFunction: theme("transitionTimingFunction.DEFAULT"),
          "&:hover": {
            color: "var(--tw-prose-links-hover)",
            textDecorationColor: "var(--tw-prose-links-underline)",
          },
        },
        strong: {
          color: "var(--tw-prose-bold)",
          fontWeight: "600",
        },

        // Overrides
        ":is(h1, h2, h3) + *": {
          marginTop: "0",
        },
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
        "--tw-prose-headings": "var(--tw-prose-invert-headings)",
        "--tw-prose-links": "var(--tw-prose-invert-links)",
        "--tw-prose-links-hover": "var(--tw-prose-invert-links-hover)",
        "--tw-prose-links-underline": "var(--tw-prose-invert-links-underline)",
        "--tw-prose-bold": "var(--tw-prose-invert-bold)",
        "--tw-prose-counters": "var(--tw-prose-invert-counters)",
        "--tw-prose-bullets": "var(--tw-prose-invert-bullets)",
        "--tw-prose-hr": "var(--tw-prose-invert-hr)",
        "--tw-prose-quotes": "var(--tw-prose-invert-quotes)",
        "--tw-prose-quote-borders": "var(--tw-prose-invert-quote-borders)",
        "--tw-prose-captions": "var(--tw-prose-invert-captions)",
        "--tw-prose-code": "var(--tw-prose-invert-code)",
        "--tw-prose-code-bg": "var(--tw-prose-invert-code-bg)",
        "--tw-prose-code-ring": "var(--tw-prose-invert-code-ring)",
        "--tw-prose-th-borders": "var(--tw-prose-invert-th-borders)",
        "--tw-prose-td-borders": "var(--tw-prose-invert-td-borders)",
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
      animation: {
        "fade-in": "fade-in 0.5s linear forwards",
        marquee: "marquee var(--marquee-duration) linear infinite",
        "spin-slow": "spin 4s linear infinite",
        "spin-slower": "spin 6s linear infinite",
        "spin-reverse": "spin-reverse 1s linear infinite",
        "spin-reverse-slow": "spin-reverse 4s linear infinite",
        "spin-reverse-slower": "spin-reverse 6s linear infinite",
      },
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
      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        marquee: {
          "100%": {
            transform: "translatey(-50%)",
          },
        },
        "spin-reverse": {
          to: {
            transform: "rotate(-360deg)",
          },
        },
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
