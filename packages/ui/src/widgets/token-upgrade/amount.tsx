import React, { useCallback, useEffect, useMemo, useRef } from "react"
import * as Form from "@radix-ui/react-form"
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx"

// FEAT: adjust right padding according the symbol present
const inputVariants = cva(
  "block w-full rounded border-0 py-1.5 sm:text-sm sm:leading-6",
  {
    variants: {
      variant: {
        disabled: "pointer-events-none pl-10 px-1.5 rounded-md",
        regular: "pl-10 pr-14 rounded-md",
        active: "pl-1 pr-14 rounded-none rounded-r-md",
      },
      err: {
        false:
          "text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
        true: "text-red-900 ring-1 ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500",
      },
    },
    defaultVariants: {
      variant: "regular",
      //@ts-expect-error weird
      err: "false",
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
  error,
  label = "Amount",
  name = "amount",
  onAmountChange,
  onAmountMaxChange,
  min = 0,
  placeholder = "0",
  step = 1,
  symbol,
  value,
  ...props
}: AmountProps) {
  let variants = {}
  const hasBalance = balance && Number(balance) > 0
  const hasError = Boolean(error)
  const inpRef = useRef<HTMLInputElement>(null)

  const onValueChange = useCallback(
    (value: string) => {
      const numValue = Number(value)
      const isValid = numValue >= 0
      if (isValid) {
        if (inpRef.current) inpRef.current.value = value
        onAmountChange?.({ amount: numValue })
      }
    },
    [onAmountChange, inpRef],
  )

  const onValueMaxChange = useCallback(
    (value: number) => {
      if (inpRef.current) inpRef.current.value = String(value)
      onAmountMaxChange?.({ amount: value })
    },
    [onAmountMaxChange, inpRef],
  )

  useEffect(() => {
    if (inpRef.current && inpRef.current.value !== String(value)) {
      inpRef.current.value = String(value || "")
    }
  }, [value])

  if (disabled) variants = { variant: "disabled" }
  if (hasBalance) variants = { variant: "active" }
  if (hasError) variants = { ...variants, err: "true" }

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
    <>
      <label
        htmlFor={name}
        id={`${name}-label`}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div
        className={clsx("mt-2 flex rounded-md shadow-sm", {
          "mb-[22px]": !hasBalance && !hasError,
        })}
      >
        {hasBalance && (
          <button
            className="relative -mr-px inline-flex w-[37px] items-center gap-x-1.5 rounded-l-md px-1.5 py-0.5 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 lg:text-sm"
            onClick={() => onValueMaxChange?.(Number(balance))}
            role="button"
            type="button"
          >
            Max
          </button>
        )}
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <Form.Control
            asChild
            disabled={disabled}
            type="number"
            onChange={(e) => {
              onValueChange(e.target.value)
            }}
          >
            <input
              aria-describedby={!hasError ? `${name}-label` : `${name}-error`}
              aria-invalid={hasError ? "true" : "false"}
              className={inputVariants(variants)}
              disabled={disabled}
              id={name}
              max={balance}
              min={min}
              name={name}
              placeholder={placeholder}
              ref={inpRef}
              step={step}
              type="number"
              role="spinbutton"
              {...props}
            />
          </Form.Control>
          {displaySymbol ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-violet11 sm:text-sm">{displaySymbol}</span>
            </div>
          ) : null}
        </div>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error?.message}
        </p>
      )}
      {Number(balance) > 0 ? (
        <div
          aria-label="balance"
          className="truncate pt-1.5 text-xs text-gray-500 hover:text-clip"
        >
          Balance: {balance} {address}
        </div>
      ) : null}
    </>
  )
}
