import {
  NotificationProvider as Notification,
  useNotificationContext,
} from "../../features/notification"
import type { StoryContext, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"

const notificationStory = {
  title: "UI/Features/Notification",
  component: Notification,
  parameters: {
    /// Disabling this will cause Storie to throw the `useMemo` error while rendering.
    //  Leave this as @radix-ui/toast component has some a11y issues
    a11y: { disable: true },
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

export const Default: StoryObj<React.ComponentProps<typeof Notification>> = {
  args: {},
  render: () => {
    const { setNotification } = useNotificationContext()

    return (
      <>
        <button
          type="button"
          role="button"
          className="ml-3 rounded-md bg-white text-sm font-medium"
          onClick={() => {
            setNotification({ message: "Notification text" })
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
      const btn = ctx.getByRole("button")
      await expect(btn).not.toBeDisabled()
      await userEvent.click(btn)
    })
  },
}
