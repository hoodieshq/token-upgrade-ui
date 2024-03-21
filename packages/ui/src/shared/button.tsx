import * as React from "react"
import clsx from "clsx"
import { cva, VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center outline-2 outline-offset-2 transition-colors rounded bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
  {
    variants: {
      variant: {
        solid: "py-2 px-3 font-semibold",
        outline:
          "border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)]",
      },
      tone: {
        cyan: "relative overflow-hidden bg-cyan-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-cyan-600 active:text-white/80 before:transition-colors",
        white:
          "bg-white text-cyan-900 hover:bg-white/90 active:bg-white/90 active:text-cyan-900/70",
        gray: "bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80",
      },
      size: {
        md: "text-md",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        tone: "gray",
        class:
          "border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80",
      },
    ],
    defaultVariants: {
      tone: "gray",
      variant: "solid",
      size: "md",
    },
  },
)

type ButtonProps = VariantProps<typeof buttonVariants> &
  (Omit<React.ComponentPropsWithoutRef<"button">, "color"> & {
    href?: undefined
  })

export function Button({ className, ...props }: ButtonProps) {
  const cn = buttonVariants({
    tone: props.tone,
    size: props.size,
    variant: props.variant,
  })

  return (
    <button
      className={clsx(className, cn)}
      role="button"
      type="button"
      {...props}
    />
  )
}
