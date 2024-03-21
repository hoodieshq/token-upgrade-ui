"use client"
import "@solana/wallet-adapter-react-ui/styles.css"
import React, { useEffect, useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"

export const Wallet: React.FC<{ children: React.ReactNode }> = ({
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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
