import React from "react"
import { useWalletConnectButton } from "@solana/wallet-adapter-base-ui"
import { WalletButton } from "./wallet-button"

const LABELS = {
  connecting: "Connecting ...",
  connected: "Connected",
  "has-wallet": "Connect",
  "no-wallet": "Connect Wallet",
}

type BaseWalletConnectButtonProps = Omit<
  React.ComponentProps<typeof WalletButton>,
  "walletIcon" | "walletName"
> & {
  labels?: {
    [TButtonState in ReturnType<
      typeof useWalletConnectButton
    >["buttonState"]]: string
  }
}

export function BaseWalletConnectButton({
  children,
  disabled,
  labels = LABELS,
  onClick,
  ...props
}: BaseWalletConnectButtonProps) {
  const { buttonDisabled, buttonState, onButtonClick, walletIcon, walletName } =
    useWalletConnectButton()

  return (
    <WalletButton
      {...props}
      disabled={disabled || buttonDisabled}
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }
        if (e.defaultPrevented) {
          return
        }
        if (onButtonClick) {
          onButtonClick()
        }
      }}
      walletIcon={walletIcon}
      walletName={walletName}
    >
      {children ? children : labels[buttonState]}
    </WalletButton>
  )
}
