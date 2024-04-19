import * as web3 from "@solana/web3.js"
import type { StoryFn, StoryObj } from "@storybook/react"
import { create } from "superstruct"
import { expect, within } from "@storybook/test"
import {
  DefaultAccountState,
  PermanentDelegate,
  TokenExtension,
  TransferFeeAmount,
  TransferHookAccount,
} from "../../entities/token/validators"
import { TokenExtensions } from "../../widgets/token-upgrade/token-extensions"

const meta = {
  title: "UI/Token Upgrade/TokenExtensions",
  component: TokenExtensions,
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
      return <Story />
    },
  ],
}

export default meta
type Story = StoryObj<typeof TokenExtensions>

const defaultAccountState = create(
  { accountState: "initialized" },
  DefaultAccountState,
)

const transferHookAccount = create({ transferring: true }, TransferHookAccount)

const permanentDelegate = create(
  { delegate: web3.Keypair.generate().publicKey },
  PermanentDelegate,
)
const transferFeeAmount = create({ withheldAmount: 0 }, TransferFeeAmount)

export const Default: Story = {
  args: {
    address: "Bk9ErfcwzZ8MgSPdEgfmkreNHad9ik8jYP8um",
    extensions: [
      create(
        { extension: "defaultAccountState", state: defaultAccountState },
        TokenExtension,
      ),
      create(
        { extension: "transferHookAccount", state: transferHookAccount },
        TokenExtension,
      ),
      create(
        { extension: "permanentDelegate", state: permanentDelegate },
        TokenExtension,
      ),
      create(
        { extension: "transferFeeAmount", state: transferFeeAmount },
        TokenExtension,
      ),
    ],
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should render extensions", async () => {
      await expect(ctx.getByText("defaultAccountState")).toBeVisible()
      await expect(ctx.getByText("transferHookAccount")).toBeVisible()
      await expect(ctx.getByText("permanentDelegate")).toBeVisible()
      await expect(ctx.getByText("transferFeeAmount")).toBeVisible()
    })
  },
}
