import React from "react"
import { Header } from "./header"
import { motion } from "framer-motion"
import { AllProviders } from "./connect-providers"

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <AllProviders>
      <div className="h-full">
        <motion.header
          layoutScroll
          className="contents lg:inset-0 lg:z-40 lg:flex"
        >
          <Header />
        </motion.header>
        <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
          {/* Footer */}
        </div>
      </div>
    </AllProviders>
  )
}
