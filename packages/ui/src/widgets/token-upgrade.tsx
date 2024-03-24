import "../styles/tailwind.css"
import * as Form from "@radix-ui/react-form"
import Amount from "./token-upgrade/amount"
import Debug from "debug"
import Destination from "./token-upgrade/destination"
import React, { useCallback } from "react"
import useTokenAmount from "../entities/token/use-token-amount"
import { Container } from "./token-upgrade/container"
import { TextField } from "../shared/fields"
import { UpgradeButton } from "../features/upgrade-button"
import { useTokenBalance } from "../entities/token/use-token-balance"
import { withErrorBoundary } from "react-error-boundary"

const error = Debug("error:token-upgrade-ui")

export interface TokenUpgradeProps
  extends Pick<React.ComponentPropsWithoutRef<"div">, "className"> {
  onUpgradeEnd?: (a: { signature: string }) => void
  onUpgradeError?: () => void
  onUpgradeStart?: () => void
  symbol?: string
  tokenAddress?: string
}

export function TokenUpgradeBase({
  onUpgradeEnd,
  onUpgradeStart,
  symbol,
  tokenAddress,
}: TokenUpgradeProps) {
  const [{ amount, destination }, setAction] = useTokenAmount()
  const { balance } = useTokenBalance(tokenAddress)

  const onAmountChange = useCallback(
    ({ amount }: { amount: number }) => {
      setAction({ type: "changeAmount", payload: { amount } })
    },
    [setAction],
  )

  const onTokenUpgrade = useCallback(async () => {
    onUpgradeStart?.()
    console.log({ amount })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const signature = ((a) => a)("signature")

    onUpgradeEnd?.({ signature })
  }, [amount, onUpgradeStart, onUpgradeEnd])

  const isAllowedUpgrade = typeof amount !== "undefined" && amount > 0

  return (
    <Form.Root className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:p-6">
        <Container>
          <Form.Field className="pb-4 pt-3.5" name="amount">
            <Amount
              address={tokenAddress}
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
    <div className="container flex flex-col">
      <div>Error initializing wallet connection.</div>
      <div>
        Did you initialize the{" "}
        <pre className="inline-block">{"<TokenUpgrade/>"}</pre> component
        properly?
      </div>
    </div>
  ),
  onError: (e: Error) => {
    error(e.message)
  },
})
