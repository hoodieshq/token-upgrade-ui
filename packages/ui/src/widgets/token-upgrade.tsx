import "../styles/tailwind.css"
import * as Form from "@radix-ui/react-form"
import * as Wallet from "@solana/wallet-adapter-react"
import * as web3 from "@solana/web3.js"
import Amount from "./token-upgrade/amount"
import clsx from "clsx"
import Debug from "debug"
import Destination from "./token-upgrade/destination"
import React, { useCallback, useMemo } from "react"
import useTokenAmount from "../entities/token/use-token-amount"
import { TextField } from "../shared/fields"
import { UpgradeButton } from "../features/upgrade-button"
import { useNotificationContext } from "../features/notification"
import { useTokenBalance } from "../entities/token/use-token-balance"
import { withErrorBoundary } from "react-error-boundary"

const error = Debug("error:token-upgrade-ui")

export interface TokenUpgradeProps {
  tokenAddress?: string
  symbol?: string
}

function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}

export function TokenUpgradeBase({
  tokenAddress,
  ...props
}: TokenUpgradeProps) {
  const [{ amount }, setS] = useTokenAmount()
  const { balance } = useTokenBalance(tokenAddress)
  const { setData } = useNotificationContext()

  const symbol = useMemo(() => {
    let s = props.symbol
    if (!s && tokenAddress) {
      s = `${tokenAddress.slice(0, 2)}..${tokenAddress.slice(-1)}`
    }
    return s
  }, [tokenAddress, props.symbol])

  const onAmountChange = useCallback(
    ({ amount }: { amount: number }) => {
      setS({ type: "changeAmount", payload: { amount } })
    },
    [setS],
  )

  const onTokenUpgrade = useCallback(() => {
    console.log("Upgrade token", amount)
    setData({ message: "Upgrading token..." })
  }, [amount, setData])

  const isAllowedUpgrade = typeof amount !== "undefined" && amount > 0

  return (
    <Form.Root className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:p-6">
        <Container>
          <Form.Field className="pb-4 pt-3.5" name="amount">
            <Amount
              balance={balance}
              disabled={!tokenAddress}
              onAmountChange={onAmountChange}
              symbol={symbol}
            />
          </Form.Field>

          <Form.Field className="pb-4 pt-3.5" name="destination">
            <Destination />
          </Form.Field>
          <UpgradeButton
            className="pb-4 pt-3.5"
            disabled={!isAllowedUpgrade}
            onClick={onTokenUpgrade}
          />
        </Container>
      </div>
    </Form.Root>
  )
}

export const TokenUpgrade = withErrorBoundary(TokenUpgradeBase, {
  fallback: (
    <>
      <div>Error initializing wallet connection.</div>
      <div>
        Did you initialize the{" "}
        <pre className="inline-block">{"<TokenUpgrade/>"}</pre> component
        properly?
      </div>
    </>
  ),
  onError: (e: Error) => {
    error(e.message)
  },
})
