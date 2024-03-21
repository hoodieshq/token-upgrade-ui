import "@solana/wallet-adapter-react-ui/styles.css"
import React, { useMemo } from "react"
import type { StoryObj } from "@storybook/react"
import { clusterApiUrl } from "@solana/web3.js"
import { expect, userEvent, within } from "@storybook/test"
import {
  PhantomWalletAdapter,
  SkyWalletAdapter,
  UnsafeBurnerWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { TokenUpgrade } from "../../widgets/token-upgrade"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"

const story = {
  title: "UI/TokenUpgrade",
  component: TokenUpgrade,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  decorators: [
    (Story: any) => {
      const endpoint = useMemo(() => clusterApiUrl("devnet"), [])
      const wallets = useMemo(() => [new SkyWalletAdapter()], [])
      return (
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Story />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      )
    },
  ],
}

export default story

export const Default: StoryObj<ComponentPropsWithTestId<typeof TokenUpgrade>> =
  {
    async play({ canvasElement, step }: any) {
      const ctx = within(canvasElement)

      //await step("should be clickable", async () => {
      //const btn = ctx.getByTestId("button")
      //await expect(btn).not.toBeDisabled()
      //await userEvent.click(btn)
      //})
    },
  }
