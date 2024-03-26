import clsx from "clsx"
import React from "react"
import { cva, VariantProps } from "class-variance-authority"

// TODO: finalize style
//  block w-full appearance-none rounded-lg border border-gray-200 bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm

const inputVariants = cva(
  "block w-full min-w-64 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ",
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
  label?: string
  onInputChange?: ({ amount }: { amount: number }) => void
}

export default function Input({
  className,
  name,
  label = "Input",
  onInputChange,
  defaultValue,
  ...props
}: InputProps) {
  let variants = {}

  return (
    <>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
      >
        {label}
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
