import { Button } from "../../shared/button"
import type { StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"

const headerStory = {
  title: "UI/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  args: {
    "data-testid": "button",
  },
}

export default headerStory

type TestIdCmpProps<T> = T & { ["data-testid"]: string }

export const Default: StoryObj<TestIdCmpProps<Parameters<typeof Button>[0]>> = {
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

export const Link: StoryObj<TestIdCmpProps<Parameters<typeof Button>[0]>> = {
  args: {
    href: "javascript:void(0);",
    children: "Link Text",
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
