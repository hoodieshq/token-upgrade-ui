import React from "react"
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
  balance: string
  onAmountChange?: ({ amount }: { amount: number }) => void
  symbol?: string
}

export default function Amount({
  balance,
  disabled,
  onAmountChange,
  symbol,
}: AmountProps) {
  let variants = {}
  if (disabled) variants = { variant: "disabled" }

  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Amount
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        {disabled ?? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
        )}
        <Form.Control
          asChild
          disabled={disabled}
          type="number"
          onChange={(e) => {
            const value = Number(e.target.value)
            console.log({ value })
            const isValid = value > 0
            if (isValid) {
              if (onAmountChange) onAmountChange({ amount: value })
            }
          }}
        >
          <input
            aria-describedby="amount"
            className={inputVariants(variants)}
            disabled={disabled}
            id="amount"
            max={balance}
            min={0}
            name="amount"
            placeholder="0.00"
            type="number"
          />
        </Form.Control>
        {symbol ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              {symbol}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
