import * as web3 from "@solana/web3.js"
import { upgradeToken, exchangeTokens } from "./upgrade/index"
import { useConnection } from "@solana/wallet-adapter-react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useWallet } from "@solana/wallet-adapter-react"

export function useTokenUpgrade() {
  const { connection } = useConnection()
  const { wallet } = useWallet()
  const client = useQueryClient()

  async function mutationFn({
    address,
    amount,
    destination,
  }: {
    address?: string
    amount?: number
    destination?: string
  }): Promise<web3.TransactionSignature> {
    return exchangeTokens(
      connection,
      holder

)
  }

  const mutation = useMutation({
    mutationFn,
    onSuccess: (_data, variables) => {
      client.invalidateQueries({
        queryKey: ["useTokenBalance", variables.address],
      })
    },
  })

  return mutation
}
