"use client"
import * as React from "react"
import Link from "next/link"
import { Header } from "../widgets/header-2"
import { motion } from "framer-motion"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-full lg:ml-72 xl:ml-80">
      <motion.header
        layoutScroll
        className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
      >
        <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 xl:w-80 lg:dark:border-white/10">
          <div className="hidden lg:flex">
            <Link href="#" aria-label="Home">
              Token Upgrade
            </Link>
          </div>
          <Header />
        </div>
      </motion.header>
      <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
        <main className="prose flex-auto">{children}</main>
        {/* Footer */}
      </div>
    </div>
  )
}
