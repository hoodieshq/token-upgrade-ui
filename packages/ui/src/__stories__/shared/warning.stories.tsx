import { Warning } from "../../shared/warning"
import type { StoryObj } from "@storybook/react"
import { expect, fn, within } from "@storybook/test"

const headerStory = {
  title: "UI/Shared/Warning",
  component: Warning,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  args: {
    "data-testid": "warning",
    onClick: fn(),
  },
}

export default headerStory

export const Default: StoryObj<typeof Warning> = {
  args: {
    message: "Warning Text",
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should be rendered", async () => {
      const el = ctx.getByRole("alert", { busy: false })
      await expect(el).toBeVisible()
    })
  },
}
