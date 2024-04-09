"use client"
import "@solana/wallet-adapter-react-ui/styles.css"
import * as web3 from "@solana/web3.js"
import React, { useCallback, useEffect, useState } from "react"
import { CLUSTER_URL } from "../env"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import {
  NotificationProvider,
  NotificationProviderProps,
} from "@solana/token-upgrade-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { ClusterContext } from "./change-cluster"

type OnInspectArgs = Parameters<
  NonNullable<NotificationProviderProps["onInspect"]>
>[0]

const queryClient = new QueryClient()

export const AllProviders: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [endpoint, setEndpoint] = useState(
    CLUSTER_URL ?? web3.clusterApiUrl(WalletAdapterNetwork.Devnet),
  )

  useEffect(() => {
    try {
      new URL(CLUSTER_URL ?? "")
    } catch (err: unknown) {
      console.error(`Invalid cluster URL. ${endpoint} will be used`)
    }
  }, [endpoint])

  const onInspect = useCallback(({ link }: OnInspectArgs) => {
    globalThis.window.open(link, "_blank")
  }, [])

  return (
    <NotificationProvider onInspect={onInspect}>
      <QueryClientProvider client={queryClient}>
        <ClusterContext.Provider value={{ endpoint, setEndpoint }}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ClusterContext.Provider>
      </QueryClientProvider>
    </NotificationProvider>
  )
}
