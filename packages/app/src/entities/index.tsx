import * as web3 from "@solana/web3.js"
import * as spl from "@solana/spl-token"
import { sendAndConfirmTransaction } from "@solana/token-upgrade-ui"
import { Wallet } from "@solana/wallet-adapter-react"

type Owner = {
  payer: web3.Keypair
  publicKey: web3.PublicKey
}

async function sleep(t = 1500) {
  const p = new Promise((res) => {
    setTimeout(() => {
      res(undefined)
    }, t)
  })

  return p
}

export async function createTokens(
  connection: web3.Connection,
  userWallet: Wallet,
  amount = 1,
  decimals = 9,
) {
  const payer = web3.Keypair.generate()
  await sleep()
  const wallet = {
    payer,
    publicKey: payer.publicKey,
  }
  //const holder = web3.Keypair.generate()
  //const oldMint = web3.Keypair.generate()
  //const newMint = web3.Keypair.generate()
  //const escrow = web3.Keypair.generate()

  await userWallet.adapter.sendTransaction(
    new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: userWallet.adapter.publicKey as web3.PublicKey,
        toPubkey: wallet.publicKey,
        lamports: web3.LAMPORTS_PER_SOL / 100,
      }),
    ),

    connection,
  )
  await sleep()

  console.log(await connection.getBalance(wallet.publicKey))
  await sleep()

  const oldToken = await spl.createMint(
    connection,
    wallet.payer,
    wallet.publicKey,
    wallet.publicKey,
    decimals,
  )
  await sleep()
  const oldATA = await spl.createAccount(
    connection,
    wallet.payer,
    oldToken,
    wallet.publicKey,
  )
  console.log(`Token ${oldToken} created`)
  await sleep()
  await spl.mintTo(
    connection,
    wallet.payer,
    oldToken,
    oldATA,
    wallet.payer,
    amount * Math.pow(10, decimals),
  )
  await sleep()
  return { owner: wallet, oldToken }
}

export async function airdropToken(
  connection: web3.Connection,
  token: web3.PublicKey,
  owner: Owner,
  amount = 1,
  decimals = 9,
) {
  console.log({ owner, token })
}
