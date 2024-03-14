import { Toast } from "../../shared/toast"
import type { StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"

const headerStory = {
  title: "UI/Toast",
  component: Toast,
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

export const Default: StoryObj<TestIdCmpProps<Parameters<typeof Toast>[0]>> = {
  args: {
    text: "Notification",
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    //await step("should be clickable", async () => {
    //const btn = ctx.getByTestId("button")
    //await expect(btn).not.toBeDisabled()
    //await userEvent.click(btn)
    //})
  },
}
