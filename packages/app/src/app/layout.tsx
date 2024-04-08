import "./globals.css"
import * as React from "react"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Token Upgrade UI",
  description: "Token Upgrade UI",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={twMerge("h-full", inter.variable)}>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
