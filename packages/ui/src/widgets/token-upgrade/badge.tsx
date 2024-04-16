import React from "react"
import { cva, VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600",
  {
    variants: {
      accent: {
        gray: "bg-gray-100 text-gray-600",
        red: "bg-red-100 text-red-700",
        yellow: "bg-yellow-100 text-yellow-800",
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        indigo: "bg-indigo-100 text-indigo-700",
        purple: "bg-purple-100 text-purple-700",
        pink: "bg-pink-100 text-pink-700",
      },
    },
    defaultVariants: {
      accent: "gray",
    },
  },
)

interface BadgeProps
  extends VariantProps<typeof badgeVariants>,
    React.ComponentPropsWithoutRef<"span"> {}

export function Badge({ accent, children }: BadgeProps) {
  return <span className={badgeVariants({ accent })}>{children}</span>
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
