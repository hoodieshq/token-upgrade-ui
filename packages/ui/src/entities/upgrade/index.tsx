import * as web3 from "@solana/web3.js"
import * as spl from "@solana/spl-token"

const upgradeTokenInstructionData = 1

type Signer = { pubkey: web3.PublicKey; isSigner: boolean; isWritable: boolean }

function addSigners(
  keys: Signer[],
  ownerOrAuthority: web3.PublicKey,
  multiSigners: (web3.PublicKey | web3.Signer)[],
) {
  if (multiSigners.length) {
    keys.push({ pubkey: ownerOrAuthority, isSigner: false, isWritable: false })
    for (const signer of multiSigners) {
      keys.push({
        pubkey: signer instanceof web3.PublicKey ? signer : signer.publicKey,
        isSigner: true,
        isWritable: false,
      })
    }
  } else {
    keys.push({ pubkey: ownerOrAuthority, isSigner: true, isWritable: false })
  }
  return keys
}

export function upgradeTokenInstruction(
  originalAccount: web3.PublicKey,
  originalMint: web3.PublicKey,
  newEscrow: web3.PublicKey,
  newAccount: web3.PublicKey,
  newMint: web3.PublicKey,
  originalTransferAuthority: web3.PublicKey,
  originalMultisigSigners: (web3.Signer | web3.PublicKey)[] = [],
  programId: web3.PublicKey = TOKEN_UPGRADE_PROGRAM_ID,
  originalTokenProgramId = spl.TOKEN_PROGRAM_ID,
  newTokenProgramId = spl.TOKEN_2022_PROGRAM_ID,
) {
  const [escrowAuthority] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("token-escrow-authority"),
      originalMint.toBuffer(),
      newMint.toBuffer(),
    ],
    programId,
  )

  let keys = [
    { pubkey: originalAccount, isSigner: false, isWritable: true },
    { pubkey: originalMint, isSigner: false, isWritable: true },
    { pubkey: newEscrow, isSigner: false, isWritable: true },
    { pubkey: newAccount, isSigner: false, isWritable: true },
    { pubkey: newMint, isSigner: false, isWritable: true },
    { pubkey: escrowAuthority, isSigner: false, isWritable: false },
    { pubkey: originalTokenProgramId, isSigner: false, isWritable: false },
    { pubkey: newTokenProgramId, isSigner: false, isWritable: false },
  ]
  keys = addSigners(keys, originalTransferAuthority, originalMultisigSigners)

  const data = Buffer.alloc(upgradeTokenInstructionData)

  return new web3.TransactionInstruction({ keys, programId, data })
}

async function exchangeTokens({
  address,
  amount,
  destination,
}: {
  address: web3.PublicKey
  amount: number
  destination?: web3.PublicKey
}): Promise<string> {
  const mintAccountRentExtemption =
    await spl.getMinimumBalanceForRentExemptAccount(connection)

  const exchangeTx = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: holder,
      newAccountPubkey: anciliaryAccountKeypair.publicKey,
      lamports: mintAccountRentExtemption,
      space: spl.ACCOUNT_SIZE,
      programId: spl.TOKEN_PROGRAM_ID,
    }),
    spl.createInitializeAccountInstruction(
      anciliaryAccountKeypair.publicKey,
      oldToken,
      holder,
    ),
    spl.createTransferInstruction(
      holderATA,
      anciliaryAccountKeypair.publicKey,
      holder,
      (AMOUNT_TO_TRANSFER / 2) * Math.pow(10, SOURCE_TOKEN_DECIMALS),
    ),
    spl.createAssociatedTokenAccountIdempotentInstruction(
      holder,
      holderNewTokenATA1,
      holder,
      newToken,
      spl.TOKEN_2022_PROGRAM_ID,
    ),
    upgradeTokenInstruction(
      anciliaryAccountKeypair.publicKey, // tokenaccount should be here
      oldToken,
      //escrowKeypair.publicKey,
      escrowAccount,
      holderNewTokenATA1,
      newToken,
      holder,
    ),
    // close anciliary token account
  )
  const sig = await sendAndConfirmTransaction(connection, exchangeTx, holder, [
    holderKeypair,
    anciliaryAccountKeypair,
  ])

  console.log("sig", sig)
}

export async function upgradeToken({
  address,
  amount,
  destination,
}: {
  address?: string
  amount?: number
  destination?: string
}): Promise<web3.TransactionSignature> {
  if (!address) throw new Error("Absent address")
  if (!amount || amount <= 0) throw new Error("Wrong amount")

  const mint = new web3.PublicKey(address)
  console.log({ address, amount, mint })

  const signature = await exchangeTokens({
    address: mint,
    amount: Number(amount),
    destination: destination ? new web3.PublicKey(destination) : undefined,
  })

  return "txsignature"
}
