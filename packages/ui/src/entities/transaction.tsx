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
  signers: web3.Keypair[],
) {
  let t9n = await enrichTxWithRecentInfo(connection, tx, payer)
  const sig = await web3.sendAndConfirmTransaction(connection, t9n, signers)

  return sig
}
