import React, { useCallback, useEffect, useMemo, useRef } from "react"
import * as Form from "@radix-ui/react-form"
import { cva, VariantProps } from "class-variance-authority"
import { shortenAddress } from "./utils"
import { twJoin } from "tailwind-merge"

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

export function Amount({
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
    (_e: React.ChangeEvent<HTMLInputElement>) => {
      if (inpRef.current) inpRef.current.value = balance
      onAmountMaxChange?.({ amount: Number(balance) })
    },
    [onAmountMaxChange, inpRef, balance],
  )

  useEffect(() => {
    if (inpRef.current && value && inpRef.current.value !== String(value)) {
      inpRef.current.value = String(value)
    }
  }, [value])

  const amountPossible = useMemo(() => {
    let variants: NonNullable<Parameters<typeof inputVariants>[0]> = {}

    if (address) variants = { ...variants, data: "present" }

    if (hasBalance) variants.variant = "active"
    if (disabled) variants.variant = "disabled"

    if (hasError) variants = { ...variants, alert: "error" }

    return variants
  }, [disabled, hasBalance, hasError, address])

  const displaySymbol = useMemo(
    () => shortenAddress(address ?? "", symbol),
    [address, symbol],
  )

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
        className={twJoin(
          "mt-2 flex rounded-md shadow-sm",
          !hasBalance && !hasError && "mb-[22px]",
        )}
      >
        {hasBalance && (
          <button
            className="relative -mr-px inline-flex w-[37px] items-center gap-x-1.5 rounded-l-md px-1.5 py-0.5 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 lg:text-sm"
            onClick={onValueMaxChange}
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
              className={inputVariants(amountPossible)}
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
            <div
              aria-label="Token Symbol"
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 font-mono"
            >
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
