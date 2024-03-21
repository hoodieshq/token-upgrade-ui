import "../styles/tailwind.css"
import * as Form from "@radix-ui/react-form"
import * as Wallet from "@solana/wallet-adapter-react"
import Amount from "./token-upgrade/amount"
import clsx from "clsx"
import Destination from "./token-upgrade/destination"
import React from "react"
import { TextField } from "../shared/fields"
import { UpgradeButton } from "../features/upgrade-button"
import { withErrorBoundary } from "react-error-boundary"
import Debug from "debug"
import useTokenAmount from "../entities/token/use-token-amount"

const error = Debug("error:token-upgrade-ui")

export interface TokenUpgradeProps {
  tokenAddress: string
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

export function TokenUpgradeBase({ tokenAddress }: TokenUpgradeProps) {
  const [data, setS] = useTokenAmount()

  console.log({ data })

  React.useEffect(() => {
    setS({ a: 123 })
  }, [setS])

  return (
    <Form.Root className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:p-6">
        <Container>
          <Form.Field className="pb-4 pt-3.5" name="amount">
            <Amount />
          </Form.Field>

          <Form.Field className="pb-4 pt-3.5" name="destination">
            <Destination />
          </Form.Field>
          <UpgradeButton className="pb-4 pt-3.5" />
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
