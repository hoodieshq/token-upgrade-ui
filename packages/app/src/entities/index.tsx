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
  //tokenUpgradeProgramId,
  amount = 1,
  decimals = 9,
) {
  //if (!tokenUpgradeProgramId) throw new Error("Absent program id")

  const payer = web3.Keypair.generate()
  await sleep()
  const wallet = {
    payer,
    publicKey: payer.publicKey,
  }

  await userWallet.adapter.sendTransaction(
    new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: userWallet.adapter.publicKey as web3.PublicKey,
        toPubkey: wallet.publicKey,
        lamports: web3.LAMPORTS_PER_SOL / 10,
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
  const newToken = await spl.createMint(
    connection,
    wallet.payer,
    wallet.publicKey,
    wallet.publicKey,
    decimals,
    undefined,
    undefined,
    spl.TOKEN_2022_PROGRAM_ID,
  )
  await sleep()
  const newATA = await spl.createAccount(
    connection,
    wallet.payer,
    newToken,
    wallet.publicKey,
    undefined,
    undefined,
    spl.TOKEN_2022_PROGRAM_ID,
  )
  console.log(`New token ${newToken} created`)
  await sleep()

  // Create escrow
  //const [tokenUpgradeAuthority] = web3.PublicKey.findProgramAddressSync(
  //[
  //Buffer.from("token-escrow-authority"),
  //oldToken.toBuffer(),
  //newToken.toBuffer(),
  //],
  //tokenUpgradeProgramId,
  //)
  //console.log(`Calculated Escrow address: ${tokenUpgradeAuthority}`)

  return { owner: wallet, oldToken, newToken }
}

export async function airdropToken(
  connection: web3.Connection,
  token: web3.PublicKey,
  owner: Owner,
  holder: Wallet,
  amount = 1,
  decimals = 9,
) {
  console.log({ owner, token })
  const holderPubkey = holder.adapter.publicKey as web3.PublicKey

  const holderATA = await spl.createAccount(
    connection,
    owner.payer,
    token,
    holderPubkey,
  )

  await spl.mintTo(
    connection,
    owner.payer,
    token,
    holderATA,
    owner.payer,
    amount * Math.pow(10, decimals),
  )
  await sleep()

  console.log(`Airdrop ${amount} of ${token}`)
}
