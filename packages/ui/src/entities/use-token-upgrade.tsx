import * as web3 from "@solana/web3.js"
import { upgradeToken } from "./upgrade/index"
import { useConnection } from "@solana/wallet-adapter-react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useWallet } from "@solana/wallet-adapter-react"
import { enrichTxWithRecentInfo, fromUiAmount } from "./transaction"

export function useTokenUpgrade() {
  const { connection } = useConnection()
  const { wallet } = useWallet()
  const client = useQueryClient()

  async function mutationFn({
    amount,
    decimals,
    destination,
    escrow,
    newAddress,
    originalAddress,
    upgradeProgramId,
  }: {
    amount?: number
    decimals?: number
    destination?: string
    escrow?: string
    newAddress?: string
    originalAddress?: string
    upgradeProgramId?: string
  }): Promise<web3.TransactionSignature> {
    if (!amount || amount <= 0) throw new Error("Wrong amount")
    if (!decimals) throw new Error("Absent mint")
    if (!escrow) throw new Error("Absent escrow address")
    if (!newAddress) throw new Error("Absent new address")
    if (!originalAddress) throw new Error("Absent original address")
    if (!upgradeProgramId) throw new Error("Absent upgrade program id")
    if (!wallet?.adapter.publicKey) throw new Error("Wallet not connected")

    const [transaction, signers] = await upgradeToken(
      connection,
      wallet.adapter.publicKey,
      new web3.PublicKey(originalAddress),
      new web3.PublicKey(newAddress),
      new web3.PublicKey(escrow),
      fromUiAmount(amount, decimals),
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
    onSuccess: () => {
      client.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "useTokenBalance",
      })
    },
  })

  return mutation
}
