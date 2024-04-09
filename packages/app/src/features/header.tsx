import { cva } from "class-variance-authority"
import { forwardRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { twJoin, twMerge } from "tailwind-merge"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

const motionInner = cva(
  "fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-end gap-12 px-4 transition sm:px-6 lg:z-30 lg:px-8",
  {
    variants: {
      backdrop: {
        blur: "backdrop-blur-sm dark:backdrop-blur",
      },
      bg: {
        opaque:
          "bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]",
      },
    },
  },
)

export const Header = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithRef<"div">
>(function Header({ className }, ref) {
  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (
    <motion.div
      ref={ref}
      className={twMerge(
        className,
        motionInner({ backdrop: "blur", bg: "opaque" }),
      )}
      style={
        {
          "--bg-opacity-light": bgOpacityLight,
          "--bg-opacity-dark": bgOpacityDark,
        } as React.CSSProperties
      }
    >
      <div
        className={twJoin(
          "absolute inset-x-0 top-full h-px transition",
          "bg-zinc-900/7.5 dark:bg-white/7.5",
        )}
      />
      <div className="flex items-center gap-5">
        <div className="flex gap-4">{}</div>
        <WalletMultiButton />
      </div>
    </motion.div>
  )
})
