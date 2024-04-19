import * as Form from "@radix-ui/react-form"
import { Amount } from "../../widgets/token-upgrade/amount"
import type { StoryFn, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, within } from "@storybook/test"

const meta = {
  title: "UI/Token Upgrade/Amount",
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
    balance: undefined,
    disabled: undefined,
    placeholder: undefined,
    step: undefined,
    symbol: undefined,
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should be rendered", async () => {
      const el = ctx.getByRole("spinbutton", { description: "Amount" })
      await expect(el).not.toBeDisabled()
    })
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should be disabled", async () => {
      const el = ctx.getByRole("spinbutton", { description: "Amount" })
      await expect(el).toBeDisabled()
    })
  },
}

export const WithAddress: Story = {
  args: {
    ...Default.args,
    address: "HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY",
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should show symbol", async () => {
      const el = ctx.getByText("HoK..jqY")
      await expect(el).toBeVisible()
    })
  },
}

export const WithSymbol: Story = {
  args: {
    ...Default.args,
    address: "HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY",
    symbol: "TKN",
  },
}

export const WithBalance: Story = {
  args: {
    ...Default.args,
    address: "HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY",
    balance: "10",
    value: "1",
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)
    const user = userEvent.setup()

    await step("should allow to change amount", async () => {
      const el = ctx.getByRole("button")
      await expect(el).toBeVisible()

      /**
       * Delay the click invocation allowing the effect to be applied.
       * Effect is needed to set the value from the props
       */
      const input = ctx.getByRole("spinbutton", { description: "Amount" })
      await new Promise((res) => setTimeout(res, 1_000))
      await user.click(el)
      await expect(input).toHaveValue(10)
    })
  },
}
