import React, { FC } from "react"
import { Wallet } from "@solana/wallet-adapter-react"
import { WalletName } from "@solana/wallet-adapter-base"
import { twMerge } from "tailwind-merge"

type ButtonProps = React.PropsWithChildren<{
  "aria-label"?: string
  className?: string
  disabled?: boolean
  endIcon?: React.ReactElement
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  role?: string
  startIcon?: React.ReactElement
  style?: React.CSSProperties
  tabIndex?: number
}>

const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      aria-label={props["aria-label"]}
      className={`wallet-adapter-button ${props.className || ""}`}
      disabled={props.disabled}
      onClick={props.onClick}
      role={props.role}
      style={props.style}
      tabIndex={props.tabIndex || 0}
      type="button"
    >
      {props.startIcon && (
        <i className="wallet-adapter-button-start-icon">{props.startIcon}</i>
      )}
      {props.children}
      {props.endIcon && (
        <i className="wallet-adapter-button-end-icon">{props.endIcon}</i>
      )}
    </button>
  )
}

interface WalletIconProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  wallet: { adapter: Pick<Wallet["adapter"], "icon" | "name"> }
}

/* eslint-disable @next/next/no-img-element */
const WalletIcon: FC<WalletIconProps> = ({ wallet, ...props }) => {
  return (
    wallet && (
      <img
        src={wallet.adapter.icon}
        alt={`${wallet.adapter.name} icon`}
        {...props}
      />
    )
  )
}
/* eslint-enable @next/next/no-img-element */

interface WalletButtonProps extends React.ComponentProps<typeof Button> {
  walletIcon?: string
  walletName?: WalletName
}

export function WalletButton({
  className,
  walletIcon,
  walletName,
  ...props
}: WalletButtonProps) {
  return (
    <Button
      {...props}
      className={twMerge("wallet-adapter-button-trigger", className)}
      startIcon={
        walletIcon && walletName ? (
          <WalletIcon
            wallet={{ adapter: { icon: walletIcon, name: walletName } }}
          />
        ) : undefined
      }
    />
  )
}
