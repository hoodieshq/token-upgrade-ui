"use client"
import "@solana/wallet-adapter-react-ui/styles.css"
import React, { useEffect, useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { clusterApiUrl } from "@solana/web3.js"
import { NotificationProvider } from "@solana/token-upgrade-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

const queryClient = new QueryClient()

export const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // TODO: cover network change
  const network = WalletAdapterNetwork.Devnet

  useEffect(() => {
    console.info(`Establish connection to ${network}`)
  }, []) // eslint-disable-line

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </NotificationProvider>
  )
}
