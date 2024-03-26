import * as web3 from "@solana/web3.js"
import { upgradeToken } from "./upgrade/index"
import { useConnection } from "@solana/wallet-adapter-react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useWallet } from "@solana/wallet-adapter-react"
import { enrichTxWithRecentInfo } from "./transaction"

export function useTokenUpgrade() {
  const { connection } = useConnection()
  const { wallet } = useWallet()
  const client = useQueryClient()

  async function mutationFn({
    amount,
    destination,
    escrow,
    newAddress,
    originalAddress,
    upgradeProgramId,
  }: {
    amount?: number
    destination?: string
    escrow?: string
    newAddress?: string
    originalAddress?: string
    upgradeProgramId?: string
  }): Promise<web3.TransactionSignature> {
    if (!upgradeProgramId) throw new Error("Absent upgrade program id")
    if (!originalAddress) throw new Error("Absent original address")
    if (!newAddress) throw new Error("Absent new address")
    if (!escrow) throw new Error("Absent escrow address")
    if (!amount || amount <= 0) throw new Error("Wrong amount")
    if (!wallet?.adapter.publicKey) throw new Error("Wallet not connected")

    const [transaction, signers] = await upgradeToken(
      connection,
      wallet.adapter.publicKey,
      new web3.PublicKey(originalAddress),
      new web3.PublicKey(newAddress),
      new web3.PublicKey(escrow),
      Number(amount),
      new web3.PublicKey(upgradeProgramId),
      destination ? new web3.PublicKey(destination) : undefined,
    )

    await enrichTxWithRecentInfo(
      connection,
      transaction,
      wallet.adapter.publicKey,
    )

    transaction.sign(...signers)

    const signature = await wallet.adapter.sendTransaction(
      transaction,
      connection,
    )

    return signature
  }

  const mutation = useMutation({
    mutationFn,
    onSuccess: (_data, variables) => {
      client.invalidateQueries({
        queryKey: ["useTokenBalance", variables.originalAddress],
      })
    },
  })

  return mutation
}
