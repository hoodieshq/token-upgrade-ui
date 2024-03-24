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
  tokenUpgradeProgramId: string,
  amount = 1,
  decimals = 9,
) {
  if (!tokenUpgradeProgramId?.length) throw new Error("Absent program id")

  const payer = web3.Keypair.generate()
  const wallet = {
    payer,
    publicKey: payer.publicKey,
  }
  await sleep()

  console.log("Transfering SOL to the issuer...")
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
  const [tokenUpgradeAuthority] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("token-escrow-authority"),
      oldToken.toBuffer(),
      newToken.toBuffer(),
    ],
    new web3.PublicKey(tokenUpgradeProgramId),
  )
  console.log(`Calculated Escrow address: ${tokenUpgradeAuthority}`)

  return { owner: wallet, oldToken, newToken }
}

export async function airdropToken(
  connection: web3.Connection,
  token: web3.PublicKey,
  token2022: web3.PublicKey,
  escrow: web3.PublicKey,
  owner: Owner,
  holder: Wallet,
  amount = 1,
  decimals = 9,
) {
  const holderPubkey = holder.adapter.publicKey as web3.PublicKey

  const holderATA = await spl.createAccount(
    connection,
    owner.payer,
    token,
    holderPubkey,
  )

  console.log(`Minting ${amount} of ${token} to ${holderATA}...`)
  await spl.mintTo(
    connection,
    owner.payer,
    token,
    holderATA,
    owner.payer,
    amount * Math.pow(10, decimals),
  )
  console.log("Old token was minted")
  await sleep()

  console.log("Minting Token-2022 to the escrow...")
  const mint2022Sig = await sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(
      spl.createMintToInstruction(
        token2022,
        escrow,
        owner.publicKey,
        amount * Math.pow(10, decimals),
        undefined,
        spl.TOKEN_2022_PROGRAM_ID,
      ),
    ),
    owner.publicKey,
    [owner.payer],
  )
  console.log("Token-2022 minted:", mint2022Sig)
  await sleep()
}
