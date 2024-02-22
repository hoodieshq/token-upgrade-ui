import Header from "../../widgets/header"
import type { StoryObj } from "@storybook/react"
import { expect, within } from "@storybook/test"

export default {
  title: "UI/Header",
  component: Header,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
}

type TestIdCmpProps<T> = T & { ["data-testid"]: string }

export const Primary: StoryObj<TestIdCmpProps<Parameters<typeof Header>[0]>> = {
  args: {
    "data-testid": "header",
  },
  async play({ canvasElement, step }) {
    const ctx = within(canvasElement)

    await step("should render", async () => {
      const h = ctx.getByTestId("header")
      const el = expect(h)
      await el.toBeVisible()
      await el.not.toBeEmptyDOMElement()
    })
  },
}
