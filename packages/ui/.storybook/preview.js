import "../src/styles/tailwind.css";
import { withThemeByClassName } from "@storybook/addon-styling";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

export const decorators = [
  withThemeByClassName({
    themes: {
      light: "",
      dark: "dark",
    },
    defaultTheme: "light",
  })
];
