import clsx from "clsx"
import React, { FC } from "react"
import { Wallet } from "@solana/wallet-adapter-react"
import { WalletName } from "@solana/wallet-adapter-base"

type ButtonProps = React.PropsWithChildren<{
  className?: string
  disabled?: boolean
  endIcon?: React.ReactElement
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  startIcon?: React.ReactElement
  style?: React.CSSProperties
  tabIndex?: number
}>

const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      className={`wallet-adapter-button ${props.className || ""}`}
      disabled={props.disabled}
      style={props.style}
      onClick={props.onClick}
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
      className={clsx("wallet-adapter-button-trigger", className)}
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
