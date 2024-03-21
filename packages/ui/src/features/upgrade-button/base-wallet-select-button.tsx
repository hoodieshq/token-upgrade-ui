import React, { useEffect, useMemo, useRef, useState } from "react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui"
import { WalletButton } from "./wallet-button"

const LABELS = {
  "change-wallet": "Change wallet",
  connecting: "Connecting ...",
  "copy-address": "Copy address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect",
  "no-wallet": "Select Wallet",
} as const

type Props = Omit<
  React.ComponentProps<typeof WalletButton>,
  "walletIcon" | "walletName"
> & {
  labels?: Omit<
    {
      [TButtonState in ReturnType<
        typeof useWalletMultiButton
      >["buttonState"]]: string
    },
    "connected" | "disconnecting"
  > & {
    "copy-address": string
    copied: string
    "change-wallet": string
    disconnect: string
  }
}

export function BaseWalletSelectButton({
  children,
  labels = LABELS,
  ...props
}: Props) {
  const { setVisible: setModalVisible } = useWalletModal()
  const {
    buttonState,
    onConnect,
    onDisconnect,
    publicKey,
    walletIcon,
    walletName,
  } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true)
    },
  })
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLUListElement>(null)
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current

      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return

      setMenuOpen(false)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [])
  const content = useMemo(() => {
    if (children) {
      return children
    } else if (publicKey) {
      const base58 = publicKey.toBase58()
      return base58.slice(0, 4) + ".." + base58.slice(-4)
    } else if (buttonState === "connecting" || buttonState === "has-wallet") {
      return labels[buttonState]
    } else {
      return labels["no-wallet"]
    }
  }, [buttonState, children, labels, publicKey])
  return (
    <div className="wallet-adapter-dropdown">
      <WalletButton
        {...props}
        aria-expanded={menuOpen}
        style={{ pointerEvents: menuOpen ? "none" : "auto", ...props.style }}
        onClick={() => {
          switch (buttonState) {
            case "no-wallet":
              setModalVisible(true)
              break
            case "has-wallet":
              if (onConnect) {
                onConnect()
              }
              break
            case "connected":
              setMenuOpen(true)
              break
          }
        }}
        walletIcon={walletIcon}
        walletName={walletName}
      >
        {content}
      </WalletButton>
      <ul
        aria-label="dropdown-list"
        className={`wallet-adapter-dropdown-list ${menuOpen && "wallet-adapter-dropdown-list-active"}`}
        ref={ref}
        role="menu"
      >
        {publicKey ? (
          <li
            className="wallet-adapter-dropdown-list-item"
            onClick={async () => {
              await navigator.clipboard.writeText(publicKey.toBase58())
              setCopied(true)
              setTimeout(() => setCopied(false), 400)
            }}
            role="menuitem"
          >
            {copied ? labels["copied"] : labels["copy-address"]}
          </li>
        ) : null}
        <li
          className="wallet-adapter-dropdown-list-item"
          onClick={() => {
            setModalVisible(true)
            setMenuOpen(false)
          }}
          role="menuitem"
        >
          {labels["change-wallet"]}
        </li>
        {onDisconnect ? (
          <li
            className="wallet-adapter-dropdown-list-item"
            onClick={() => {
              onDisconnect()
              setMenuOpen(false)
            }}
            role="menuitem"
          >
            {labels["disconnect"]}
          </li>
        ) : null}
      </ul>
    </div>
  )
}
