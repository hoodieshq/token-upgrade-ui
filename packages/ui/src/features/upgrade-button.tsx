import clsx from "clsx"
import React from "react"
import { BaseWalletConnectButton } from "./upgrade-button/base-wallet-connect-button"
import { BaseWalletSelectButton } from "./upgrade-button/base-wallet-select-button"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "../shared/button"

interface UpgradeButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

export function UpgradeButton({ className }: UpgradeButtonProps) {
  const { connected, wallet } = useWallet()

  const noWallet = !Boolean(wallet)

  return (
    <div
      className={clsx(
        {
          "[&_.wallet-adapter-dropdown]:w-[100%]": noWallet,
        },
        className,
      )}
    >
      {connected ? (
        <Button className="h-[48px] w-[100%]">Upgrade Token</Button>
      ) : noWallet ? (
        <>
          <BaseWalletSelectButton className="w-[100%] justify-center" />
        </>
      ) : (
        <BaseWalletConnectButton className="w-[100%] justify-center" />
      )}
    </div>
  )
}
