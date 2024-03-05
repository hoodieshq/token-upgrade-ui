import * as React from "react"
import Link from "next/link"
import { cva, VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex justify-center rounded-lg outline-2 outline-offset-2 transition-colors",
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
        sm: "text-sm",
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
      size: "sm",
    },
  },
)

type ButtonProps = VariantProps<typeof buttonVariants> &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "color">
    | (Omit<React.ComponentPropsWithoutRef<"button">, "color"> & {
        href?: undefined
      })
  )

export function Button({ className, ...props }: ButtonProps) {
  props.size ??= "sm"
  props.tone ??= "gray"
  props.variant ??= "solid"

  className = buttonVariants({
    tone: props.tone,
    size: props.size,
    variant: props.variant,
  })

  return typeof props.href === "undefined" ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
