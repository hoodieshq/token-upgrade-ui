import defaultTheme from "tailwindcss/defaulttheme";
import formsPlugin from "@tailwindcss/forms";
import headlessuiPlugin from "@headlessui/tailwindcss";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontsize: {
      xs: ["0.75rem", { lineheight: "1rem" }],
      sm: ["0.875rem", { lineheight: "1.5rem" }],
      base: ["1rem", { lineheight: "1.5rem" }],
      lg: ["1.125rem", { lineheight: "2rem" }],
      xl: ["1.25rem", { lineheight: "1.75rem" }],
      "2xl": ["1.5rem", { lineheight: "2rem" }],
      "3xl": ["2rem", { lineheight: "3rem" }],
      "4xl": ["2.5rem", { lineheight: "3rem" }],
      "5xl": ["3rem", { lineheight: "1" }],
      "6xl": ["3.75rem", { lineheight: "1" }],
      "7xl": ["4.5rem", { lineheight: "1" }],
      "8xl": ["6rem", { lineheight: "1" }],
      "9xl": ["8rem", { lineheight: "1" }],
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
      borderradius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      colors: ({ colors }) => ({
        gray: colors.neutral,
      }),
      fontfamily: {
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
      maxwidth: {
        "2xl": "40rem",
      },
    },
  },
  plugins: [formsPlugin, headlessuiPlugin],
} satisfies Config;
