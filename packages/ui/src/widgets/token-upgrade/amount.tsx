import React, { useMemo } from "react"
import * as Form from "@radix-ui/react-form"
import { cva, VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "block w-full min-w-64 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
  {
    variants: {
      variant: {
        disabled: "cursor-not-allowed px-1.5",
        regular: "pl-7 pr-12",
      },
    },
    defaultVariants: {
      variant: "regular",
    },
  },
)

interface AmountProps
  extends VariantProps<typeof inputVariants>,
    React.ComponentPropsWithoutRef<"input"> {
  address?: string
  balance: string
  name?: string
  onAmountChange?: ({ amount }: { amount: number }) => void
  symbol?: string
}

export default function Amount({
  address,
  balance,
  disabled,
  name = "amount",
  onAmountChange,
  symbol,
}: AmountProps) {
  let variants = {}
  if (disabled) variants = { variant: "disabled" }

  const displaySymbol = useMemo(() => {
    let s = symbol
    if (!s && address && address.length > 3) {
      s = `${address.slice(0, 2)}..${address.slice(-1)}`
    } else if (!s && address && address?.length <= 3) {
      s = address
    }
    return s
  }, [address, symbol])

  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Amount
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        {disabled ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm"></span>
          </div>
        ) : null}
        <Form.Control
          asChild
          disabled={disabled}
          type="number"
          onChange={(e) => {
            const value = Number(e.target.value)
            const isValid = value > 0
            if (isValid) {
              if (onAmountChange) onAmountChange({ amount: value })
            }
          }}
        >
          <input
            aria-describedby={name}
            className={inputVariants(variants)}
            disabled={disabled}
            id={name}
            max={balance}
            min={0}
            name={name}
            placeholder="0.00"
            type="number"
          />
        </Form.Control>
        {displaySymbol ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{displaySymbol}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
