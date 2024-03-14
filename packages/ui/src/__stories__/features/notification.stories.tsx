import { NotificationProvider as Notification } from "../../features/notification"
import type { StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"

const headerStory = {
  title: "UI/Notification",
  component: Notification,
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

export const Default: StoryObj<
  TestIdCmpProps<Parameters<typeof Notification>[0]>
> = {
  args: {},
  render: (...args) => {
    console.log({ args })

    return (
      <>
        <button
          type="button"
          role="show-toast"
          className="ml-3 rounded-md bg-white text-sm font-medium"
          onClick={() => {}}
        >
          Show Notification
        </button>
        <Notification />
      </>
    )
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should call toast", async () => {
      const btn = ctx.getByRole("show-toast")
      await expect(btn).not.toBeDisabled()
      await userEvent.click(btn)
    })
  },
}
