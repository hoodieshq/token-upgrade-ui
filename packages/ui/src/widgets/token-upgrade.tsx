import "../styles/tailwind.css"
import * as Form from "@radix-ui/react-form"
import Amount from "./token-upgrade/amount"
import Debug from "debug"
import Destination from "./token-upgrade/destination"
import React, { useCallback } from "react"
import useTokenAmount from "../entities/token/use-token-amount"
import { Container } from "./token-upgrade/container"
import { UpgradeButton } from "../features/upgrade-button"
import { useTokenBalance } from "../entities/token/use-token-balance"
import { withErrorBoundary } from "react-error-boundary"
import { useTokenUpgrade } from "../entities/use-token-upgrade"

const error = Debug("error:token-upgrade-ui")

export interface TokenUpgradeProps
  extends Pick<React.ComponentPropsWithoutRef<"div">, "className"> {
  escrow?: string
  onUpgradeEnd?: (a: { signature: string }) => void
  onUpgradeError?: (e: Error) => void
  onUpgradeStart?: () => void
  symbol?: string
  tokenAddress?: string
  tokenExtAddress?: string
  tokenUpgradeProgramId?: string
}

export function TokenUpgradeBase({
  escrow,
  onUpgradeEnd,
  onUpgradeError,
  onUpgradeStart,
  symbol,
  tokenAddress,
  tokenExtAddress,
  tokenUpgradeProgramId,
}: TokenUpgradeProps) {
  const [{ amount, destination }, setAction] = useTokenAmount()
  const { balance } = useTokenBalance(tokenAddress, { placeholderData: "0" })
  const { mutate } = useTokenUpgrade()

  const onAmountChange = useCallback(
    ({ amount }: { amount: number }) => {
      setAction({ type: "changeAmount", payload: { amount } })
    },
    [setAction],
  )

  const onTokenUpgrade = useCallback(async () => {
    onUpgradeStart?.()

    mutate(
      {
        amount,
        destination,
        escrow,
        newAddress: tokenExtAddress,
        originalAddress: tokenAddress,
        upgradeProgramId: tokenUpgradeProgramId,
      },
      {
        onSuccess: (signature) => {
          onUpgradeEnd?.({ signature })
        },
        onError: (error: Error) => {
          onUpgradeError?.(error)
        },
      },
    )
  }, [
    amount,
    destination,
    escrow,
    mutate,
    onUpgradeEnd,
    onUpgradeError,
    onUpgradeStart,
    tokenAddress,
    tokenExtAddress,
    tokenUpgradeProgramId,
  ])

  const isAllowedUpgrade = typeof amount !== "undefined" && amount > 0

  return (
    <Form.Root className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:p-6">
        <Container>
          <Form.Field className="pb-4 pt-3.5" name="amount">
            <Amount
              address={tokenAddress}
              balance={balance ?? "0"}
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
