import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    //"../stories/**/*.mdx",
    "../src/__stories__/*/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    {
      name: "@storybook/addon-styling",
      options: {
        postCss: true,
      },
    },
  ],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  "build": {
    "test": {
      disabledAddons: [
        "@storybook/addon-docs",
        "@storybook/addon-essentials/docs",
      ],
    }
  },
  previewHead: (head) => `
    ${head}
    ${`
      <style type="text/css">html{ --font-inter: sans-serif; }</style>
    `}
  `,
  webpackFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...(config.resolve ||{}),
        fallback: {
          crypto: false,
          http: false,
          https: false,
          stream: false,
          zlib: false,
        }
      }
    }

  }
};
export default config;
