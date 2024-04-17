import { TokenInfoBase as TokenInfo } from "../../widgets/token-upgrade/token-info"
import type { StoryFn, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"

const meta = {
  title: "UI/Token Upgrade/TokenInfo",
  component: TokenInfo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  args: {},
  argTypes: {},
  decorators: [
    (Story: StoryFn) => {
      return (
        <div data-testid="story-inner-wrapper">
          <Story />
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof TokenInfo>

export const Default: Story = {
  args: {
    address: "Bk9ErfcwzZ8MgSPdEgfmkreNHad9ik8jYP8um",
    extensions: [
      {
        extension: "permanentDelegate",
        state: { delegate: "DELEGATE_ADDRESS" },
      },
    ],
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should render extensions", async () => {
      const pdExtension = ctx.getByText("permanentDelegate")
      await expect(pdExtension).toBeVisible()
      await expect(pdExtension).not.toBeDisabled()
      await userEvent.click(pdExtension)
      await userEvent.click(canvasElement)
    })
  },
}

export const NoExtensions: Story = {
  args: {
    address: "Bk9ErfcwzZ8MgSPdEgfmkreNHad9ik8jYP8um",
    extensions: [],
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should render text message", async () => {
      await expect(
        ctx.getByText("There are no token extensions enabled."),
      ).toBeVisible()
      await expect(ctx.getByRole("alert", { busy: false })).toBeVisible()
    })
  },
}

export const Failure: Story = {
  args: {
    address: "Bk9ErfcwzZ8MgSPdEgfmkreNHad9ik8jYP8um",
    error: new Error("Can not fetch token info"),
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should render warning", async () => {
      await expect(ctx.getByRole("alert", { busy: false })).toBeVisible()
    })
  },
}

export const Empty: Story = {
  args: {
    address: undefined,
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should render nothing", async () => {
      const el = ctx.getByTestId("story-inner-wrapper")
      await expect(el).toBeEmptyDOMElement()
    })
  },
}
