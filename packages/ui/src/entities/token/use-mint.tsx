import * as spl from "@solana/spl-token"
import * as web3 from "@solana/web3.js"
import { NATIVE_MINT } from "@solana/spl-token"
import { useConnection } from "@solana/wallet-adapter-react"
import { QueryObserverOptions, useQuery } from "@tanstack/react-query"

export function useMint(
  address: web3.PublicKey | string | undefined,
  opts?: Pick<
    QueryObserverOptions<spl.Mint | undefined>,
    "refetchInterval" | "refetchIntervalInBackground" | "placeholderData"
  >,
) {
  const { connection } = useConnection()

  const { data, error } = useQuery({
    enabled: Boolean(address),
    placeholderData: opts?.placeholderData,
    queryFn: async (): Promise<spl.Mint | undefined> => {
      if (!address) return undefined
      if (typeof address === "string") {
        address = new web3.PublicKey(address)
      }

      if (NATIVE_MINT.equals(new web3.PublicKey(address))) {
        return undefined
      } else {
        const mint = spl.getMint(connection, address)
        return mint
      }
    },
    queryKey: ["useMint", address],
    refetchInterval: opts?.refetchInterval,
    refetchIntervalInBackground: opts?.refetchIntervalInBackground,
  })

  return { mint: data, error }
}
