import React from "react"
import { BaseWalletConnectButton } from "./upgrade-button/base-wallet-connect-button"
import { BaseWalletSelectButton } from "./upgrade-button/base-wallet-select-button"
import { Button } from "../shared/button"
import { twMerge } from "tailwind-merge"
import { useWallet } from "@solana/wallet-adapter-react"

interface UpgradeButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  isAllowedUpgrade?: boolean
}

export function UpgradeButton({
  className,
  isAllowedUpgrade,
  ...props
}: UpgradeButtonProps) {
  const { connected, wallet } = useWallet()
  const noWallet = !Boolean(wallet)

  return (
    <div
      className={twMerge(
        className,
        noWallet && "[&_.wallet-adapter-dropdown]:w-[100%]",
      )}
    >
      {connected ? (
        <Button
          className="h-[48px] w-[100%]"
          disabled={!isAllowedUpgrade}
          {...props}
        >
          Upgrade Token
        </Button>
      ) : noWallet ? (
        <BaseWalletSelectButton
          aria-label="Select Wallet"
          className="w-[100%] justify-center"
          role="button"
          {...props}
        />
      ) : (
        <BaseWalletConnectButton
          className="w-[100%] justify-center"
          role="button"
          {...props}
        />
      )}
    </div>
  )
}
