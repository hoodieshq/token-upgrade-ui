import "../styles/tailwind.css"
import * as Form from "@radix-ui/react-form"
import Debug from "debug"
import React, { useCallback, useMemo } from "react"
import useTokenAmount from "../entities/token/use-token-amount"
import { Amount } from "./token-upgrade/amount"
import { Container } from "./token-upgrade/container"
import { TokenInfo } from "./token-upgrade/token-info"
import { twMerge } from "tailwind-merge"
import { UpgradeButton } from "../features/upgrade-button"
import { useMint } from "../entities/token/use-mint"
import { useTokenBalance } from "../entities/token/use-token-balance"
import { useTokenUpgrade } from "../entities/use-token-upgrade"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { withErrorBoundary } from "react-error-boundary"
import { getCluster } from "../entities/transaction"

const error = Debug("error:token-upgrade-ui:token-upgrade")

export interface TokenUpgradeProps
  extends Pick<React.ComponentPropsWithoutRef<"div">, "className"> {
  escrow?: string
  explorerUrl: string
  onUpgradeEnd?: (a: { signature: string }) => void
  onUpgradeError?: (e: Error) => void
  onUpgradeStart?: () => void
  symbol?: string
  tokenAddress?: string
  tokenExtAddress?: string
  tokenUpgradeProgramId?: string
}

export function TokenUpgradeBase({
  className,
  escrow,
  explorerUrl,
  onUpgradeEnd,
  onUpgradeError,
  onUpgradeStart,
  symbol,
  tokenAddress,
  tokenExtAddress,
  tokenUpgradeProgramId,
}: TokenUpgradeProps) {
  const [{ uiAmount }, setAction] = useTokenAmount()
  const { balance } = useTokenBalance(tokenAddress)
  const { connection } = useConnection()
  const { mint } = useMint(tokenAddress)
  const { mutate } = useTokenUpgrade()
  const { wallet } = useWallet()

  const clusterMoniker = useMemo(
    () => getCluster(connection.rpcEndpoint),
    [connection],
  )

  const onAmountChange = useCallback(
    ({ amount }: { amount: number }) => {
      setAction({ type: "changeAmount", payload: { uiAmount: amount } })
    },
    [setAction],
  )

  const onTokenUpgrade = useCallback(async () => {
    onUpgradeStart?.()

    mutate(
      {
        amount: uiAmount,
        decimals: mint?.decimals,
        escrow,
        newAddress: tokenExtAddress,
        originalAddress: tokenAddress,
        upgradeProgramId: tokenUpgradeProgramId,
      },
      {
        onSuccess: (signature) => {
          setAction({ type: "clear" })
          onUpgradeEnd?.({ signature })
        },
        onError: (error: Error) => {
          onUpgradeError?.(error)
        },
      },
    )
  }, [
    uiAmount,
    escrow,
    mint,
    mutate,
    onUpgradeEnd,
    onUpgradeError,
    onUpgradeStart,
    setAction,
    tokenAddress,
    tokenExtAddress,
    tokenUpgradeProgramId,
  ])

  const { ph, step } = useMemo(() => {
    if (!mint?.decimals) return { ph: undefined, step: undefined }

    const float = Math.pow(10, -1 * mint.decimals)

    return { ph: float.toFixed(mint.decimals), step: float * 1e3 }
  }, [mint?.decimals])

  const isAllowedUpgrade = typeof uiAmount !== "undefined" && uiAmount > 0

  const error = useMemo(() => {
    if (balance?.decimals === -1)
      return new Error("Wallet does not hold the token")
    return undefined
  }, [balance])

  const isInputDisabled = useMemo(() => {
    return !wallet || !tokenAddress || Boolean(error)
  }, [tokenAddress, error, wallet])

  return (
    <Form.Root
      className={twMerge(
        className,
        "flex min-w-80 flex-col overflow-hidden rounded-lg bg-white shadow",
      )}
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <div className="px-4 py-4 sm:p-6">
        <Container>
          <Form.Field className="pb-4 pt-3.5" name="amount">
            <Amount
              address={tokenAddress}
              balance={balance?.uiAmountString}
              disabled={isInputDisabled}
              error={error}
              onAmountChange={onAmountChange}
              onAmountMaxChange={onAmountChange}
              placeholder={ph}
              step={step}
              symbol={symbol}
              value={uiAmount}
            />
          </Form.Field>
          <Form.Field className="pb-4 pt-3.5" name="tokenInfo">
            <TokenInfo
              address={tokenExtAddress}
              clusterMoniker={clusterMoniker}
              explorerUrl={explorerUrl}
            />
          </Form.Field>
          <UpgradeButton
            className="pb-4 pt-3.5"
            isAllowedUpgrade={isAllowedUpgrade}
            onClick={onTokenUpgrade}
          />
        </Container>
      </div>
    </Form.Root>
  )
}

export const TokenUpgrade = withErrorBoundary(TokenUpgradeBase, {
  fallback: (
    <div className="flex flex-col">
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
