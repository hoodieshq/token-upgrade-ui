import React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const badgeVariants = cva(
  "items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600",
  {
    variants: {
      accent: {
        gray: "!bg-gray-100 text-gray-600",
        red: "!bg-red-100 text-red-700",
        yellow: "!bg-yellow-100 text-yellow-800",
        green: "!bg-green-100 text-green-700",
        blue: "!bg-blue-100 text-blue-700",
        indigo: "!bg-indigo-100 text-indigo-700",
        purple: "!bg-purple-100 text-purple-700",
        pink: "!bg-pink-100 text-pink-700",
      },
    },
    defaultVariants: {
      accent: "gray",
    },
  },
)

interface BadgeProps
  extends VariantProps<typeof badgeVariants>,
    React.ComponentPropsWithRef<"span"> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ accent, children, className, ...props }, ref) => {
    return (
      <span
        className={twMerge(badgeVariants({ accent }), className)}
        role="menuitem"
        {...props}
        ref={ref}
      >
        {children}
      </span>
    )
  },
)
Badge.displayName = "Badge"

export enum AccentVariant {
  "gray" = "gray",
  "red" = "red",
  "yellow" = "yellow",
  "green" = "green",
  "blue" = "blue",
  "indigo" = "indigo",
  "purple" = "purple",
  "pink" = "pink",
}

export const variants = {
  accent: [
    "gray",
    "red",
    "yellow",
    "green",
    "blue",
    "indigo",
    "purple",
    "pink",
  ],
}
