import React, {  useEffect, useState } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { TokenExtensions } from "./token-extensions"
import { useTokenExtension } from "../../entities/token/use-token-extension"
import { Warning } from "../../shared/warning"

const inputVariants = cva(
  "block w-full rounded border-0 py-1.5 sm:text-sm sm:leading-6",
  {
    variants: {
      data: {
        absent: "pl-10 pr-1.5",
        present: "pl-10 pr-20",
      },
      variant: {
        disabled: "pointer-events-none rounded-md",
        regular: "rounded-md",
        active: "rounded-none rounded-r-md",
      },
      alert: {
        no: "text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
        error:
          "text-red-900 ring-1 ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500",
      },
    },
    compoundVariants: [
      {
        variant: "disabled",
        alert: "error",
        class: "pr-20",
      },
      {
        variant: "active",
        data: "present",
        class: "!pl-1",
      },
    ],
    defaultVariants: {
      data: "absent",
      variant: "regular",
      alert: "no",
    },
  },
)

interface AmountProps
  extends VariantProps<typeof inputVariants>,
    React.ComponentPropsWithoutRef<"input"> {
  address?: string
  balance?: string
  error?: Error
  label?: string
  name?: string
  onAmountChange?: (a: { amount: number }) => void
  onAmountMaxChange?: (a: { amount: number }) => void
  symbol?: string
}

export default function Amount({
  address,
  balance = "0",
  disabled,
  label = "Amount",
  name = "amount",
  onAmountChange,
  onAmountMaxChange,
  min = 0,
  placeholder = "0",
  step = 1,
  symbol,
  value,
}: AmountProps) {
  const { extensions, error, isLoading } = useTokenExtension(address)
  const [err, setError] = useState<Error | null>()

  useEffect(() => {
    if (!isLoading) setError(error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <>
      {err ? (
        <Warning message="Can not load token extensions" />
      ) : extensions ? (
        <>
          <div className="py-2">
            <TokenExtensions address={address} extensions={extensions} />
          </div>
          <Warning message="There is no way to get your original token back after upgrade." />
        </>
      ) : null}
    </>
  )
}
