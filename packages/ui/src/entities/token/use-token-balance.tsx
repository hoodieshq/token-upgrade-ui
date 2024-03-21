import * as web3 from "@solana/web3.js"
import { NATIVE_MINT } from "@solana/spl-token"
import { useConnection } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"
import { useWallet } from "@solana/wallet-adapter-react"

export function useTokenBalance(address?: web3.PublicKey | string) {
  const { connection } = useConnection()
  const { wallet } = useWallet()
  const publicKey = wallet?.adapter.publicKey

  const { data: balance, error } = useQuery({
    queryFn: async () => {
      // no token selected yet
      if (!address) {
        return "0"
      }

      if (typeof address === "string") {
        address = new web3.PublicKey(address)
      }

      if (!publicKey) {
        // no wallet connected yet on solana
        return "0"
      }

      if (NATIVE_MINT.equals(new web3.PublicKey(address))) {
        const balance = await connection.getBalance(publicKey)
        const amount = balance / web3.LAMPORTS_PER_SOL

        return amount.toFixed(
          Math.fround(Math.log(web3.LAMPORTS_PER_SOL) / Math.log(10)),
        )
      } else {
        // Get the initial solana token balance
        const results = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: address },
        )

        console.log({ results })

        for (const item of results.value) {
          // TODO: use schema to parse values
          const tokenInfo = {
            mint: item.account.data.parsed.info.mint,
            tokenAmount: item.account.data.parsed.info.tokenAmount,
          }
          const address = tokenInfo.mint
          const amount = tokenInfo.tokenAmount.uiAmountString
          if (address === address) {
            return amount
          }
        }
      }
      return "0"
    },
    queryKey: ["useTokenBalance", address, publicKey],
  })

  return { balance, error }
}
