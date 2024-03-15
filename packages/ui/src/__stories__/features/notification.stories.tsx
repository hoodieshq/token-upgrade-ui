import {
  NotificationProvider as Notification,
  useNotificationContext,
} from "../../features/notification"
import type { StoryContext, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"

const notificationStory = {
  title: "UI/Notification",
  component: Notification,
  parameters: {
    a11y: { disable: true }, // TODO: fix issues
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    swipeDirection: {
      description: "Direction to swipe notification to",
      control: "select",
      options: ["left", "right", "up", "down"],
    },
  },
  decorators: [
    (Story: any, data: StoryContext) => (
      <div style={{ height: "120px" }}>
        <Notification {...data.args}>
          <Story />
        </Notification>
      </div>
    ),
  ],
}

export default notificationStory

type TestIdCmpProps<T> = T & { ["data-testid"]: string }

export const Default: StoryObj<
  TestIdCmpProps<Parameters<typeof Notification>[0]>
> = {
  args: {
    swipeDirection: "left",
  },
  render: (...args) => {
    console.log({ args })
    const { setData } = useNotificationContext()

    return (
      <>
        <button
          type="button"
          role="show-toast"
          className="ml-3 rounded-md bg-white text-sm font-medium"
          onClick={() => {
            setData({ message: "Notification text" })
          }}
        >
          Show Notification
        </button>
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
