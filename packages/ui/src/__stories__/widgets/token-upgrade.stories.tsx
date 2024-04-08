import "@solana/wallet-adapter-react-ui/styles.css"
import React, { useMemo } from "react"
import type { StoryObj } from "@storybook/react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { clusterApiUrl } from "@solana/web3.js"
import { expect, fn, within } from "@storybook/test"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TokenUpgrade } from "../../widgets/token-upgrade"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

const story = {
  title: "UI/TokenUpgrade",
  component: TokenUpgrade,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  args: {
    onUpgradeEnd: fn(),
    onUpgradeError: fn(),
    onUpgradeStart: fn(),
  },
  argTypes: {},
  decorators: [
    (Story: any) => {
      const endpoint = useMemo(() => clusterApiUrl("devnet"), [])
      const queryClient = new QueryClient()

      return (
        <QueryClientProvider client={queryClient}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
              <WalletModalProvider>
                <Story />
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </QueryClientProvider>
      )
    },
  ],
}

export default story

export const Default: StoryObj<ComponentPropsWithTestId<typeof TokenUpgrade>> =
  {
    async play({ canvasElement, step }: any) {
      const ctx = within(canvasElement)

      await step("should render", async () => {
        await expect(ctx.getByLabelText("Select Wallet")).not.toBeDisabled()
        await expect(
          ctx.getByRole("spinbutton", { description: "Amount" }),
        ).toBeDisabled()
      })

      await step("should toggle destination field", async () => {
        const cbx = ctx.getByLabelText("toggle-destination")
        await expect(cbx).toBeDisabled()
      })
    },
  }

export const WithTokenAddress: StoryObj<
  ComponentPropsWithTestId<typeof TokenUpgrade>
> = {
  args: {
    tokenAddress: "HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY",
  },
  async play({ canvasElement, step }: any) {
    const ctx = within(canvasElement)

    await step("should not allow to change amount", async () => {
      const input = ctx.getByRole("spinbutton", { description: "Amount" })

      await expect(input).toBeDisabled()
      await expect(ctx.getByLabelText("Select Wallet")).not.toBeDisabled()
    })
  },
}
