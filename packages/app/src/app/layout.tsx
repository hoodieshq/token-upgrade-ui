import "./globals.css"
import * as React from "react"
import clsx from "clsx"
import { Inter } from "next/font/google"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Token Upgrade UI",
  description: "Token Upgrade UI",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={clsx("h-full", inter.variable)}>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
