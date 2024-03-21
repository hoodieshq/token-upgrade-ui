"use client"
import * as React from "react"
import { Header } from "../features/header"
import { motion } from "framer-motion"
import { AllProviders } from "../features/connect-providers"

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AllProviders>
      <div className="h-full">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
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
