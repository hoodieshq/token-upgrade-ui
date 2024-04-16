import * as Form from "@radix-ui/react-form"
import Amount from "../../widgets/token-upgrade/amount"
import type { StoryFn, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, within } from "@storybook/test"

const meta = {
  title: "UI/Token Upgrade/Token Info",
  component: Amount,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  args: {
    onAmountChange: fn(),
    onAmountMaxChange: fn(),
  },
  argTypes: {
    address: { control: "text" },
    balance: { control: "text" },
    label: { control: "text" },
    name: { control: "text" },
    step: { control: "number" },
    symbol: { control: "text" },
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <Form.Root>
          <Form.Field name="amount">
            <Story />
          </Form.Field>
        </Form.Root>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof Amount>

export const Default: Story = {
  args: {
    address: undefined,
  },
  /*
   *  async play({ canvasElement, step }: any) {
   *    const ctx = within(canvasElement)
   *
   *    await step("should be rendered", async () => {
   *      const el = ctx.getByRole("spinbutton", { description: "Amount" })
   *      await expect(el).not.toBeDisabled()
   *    })
   *  },
   */
}
