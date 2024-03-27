import { Button } from "../../shared/button"
import type { StoryObj } from "@storybook/react"
import { expect, fn, userEvent, within } from "@storybook/test"

const headerStory = {
  title: "UI/Shared/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  args: {
    "data-testid": "button",
    onClick: fn(),
  },
}

export default headerStory

export const Default: StoryObj<ComponentPropsWithTestId<typeof Button>> = {
  args: {
    children: "Button Text",
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should be clickable", async () => {
      const btn = ctx.getByTestId("button")
      await expect(btn).not.toBeDisabled()
      await userEvent.click(btn)
    })
  },
}
