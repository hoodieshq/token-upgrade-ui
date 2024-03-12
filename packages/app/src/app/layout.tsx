import "./globals.css"
import * as React from "react"
import clsx from "clsx"
import Layout from "../pages/layout"
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
    <html
      lang="en"
      className={clsx("h-full", inter.variable)}
      suppressHydrationWarning={false}
    >
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <div className="w-full">
          <Layout>{children}</Layout>
        </div>
      </body>
    </html>
  )
}
