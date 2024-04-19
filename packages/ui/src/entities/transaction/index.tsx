import * as web3 from "@solana/web3.js"

export async function enrichTxWithRecentInfo(
  connection: web3.Connection,
  tx: web3.Transaction,
  payer: web3.PublicKey,
) {
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
  tx.feePayer = payer

  return tx
}

export async function sendAndConfirmTransaction(
  connection: web3.Connection,
  tx: web3.Transaction,
  payer: web3.PublicKey,
  signers: web3.Signer[],
) {
  let t9n = await enrichTxWithRecentInfo(connection, tx, payer)
  const sig = await web3.sendAndConfirmTransaction(connection, t9n, signers)

  return sig
}

/**
 *  Converting uiAmount to the number of lamports.
 */
export function fromUiAmount(uiAmount: number, decimals: number) {
  const result = (1e10 * uiAmount * Math.pow(10, decimals)) / 1e10

  return Math.floor(result)
}

/**
 *  Get cluster' moniker from connection
 */
export function getCluster(rpc: string) {
  function getMoniker(s: string): web3.Cluster | "custom" {
    if (s === web3.clusterApiUrl("devnet")) return "devnet"
    if (s === web3.clusterApiUrl("mainnet-beta")) return "mainnet-beta"
    if (s === web3.clusterApiUrl("testnet")) return "testnet"
    return "custom"
  }
  return getMoniker(rpc)
}
