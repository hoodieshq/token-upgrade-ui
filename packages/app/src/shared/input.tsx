import clsx from "clsx"
import React from "react"
import { cva, VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "block w-full min-w-64 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
  {
    variants: {
      variant: {
        regular: "pl-7 pr-12",
      },
    },
    defaultVariants: {
      variant: "regular",
    },
  },
)

interface InputProps
  extends VariantProps<typeof inputVariants>,
    React.ComponentPropsWithoutRef<"input"> {
  onInputChange?: ({ amount }: { amount: number }) => void
}

export default function Input({
  className,
  name,
  onInputChange,
  defaultValue,
  ...props
}: InputProps) {
  let variants = {}

  return (
    <>
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Escrow Address
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          aria-describedby={name}
          className={clsx(inputVariants(variants), className)}
          defaultValue={defaultValue}
          id={name}
          name={name}
          placeholder="Escrow Address"
          type="text"
          {...props}
        />
      </div>
    </>
  )
}
