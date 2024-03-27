import * as spl from "@solana/spl-token"
import * as web3 from "@solana/web3.js"
import Debug from "debug"

const log = Debug("token-upgrade-ui:upgrade")

const upgradeTokenInstructionData = 1

type Signer = { pubkey: web3.PublicKey; isSigner: boolean; isWritable: boolean }

export async function upgradeToken(
  connection: web3.Connection,
  holder: web3.PublicKey,
  oldToken: web3.PublicKey,
  newToken: web3.PublicKey,
  escrow: web3.PublicKey,
  amount: number,
  upgradeProgramId: web3.PublicKey,
  destination?: web3.PublicKey,
): Promise<[web3.Transaction, web3.Signer[]]> {
  const originalMint = await spl.getMint(connection, oldToken)

  /// Anciliary creation
  //  Store N amount of token to upgrade
  const anciliaryAccountKeypair = web3.Keypair.generate()
  log(`Anciliary account: ${anciliaryAccountKeypair.publicKey}`)

  const destinationAddress = destination ??= holder
  const destinationOwner = destination ? destination : holder

  /// Holder or Destination ATA calculation for new token
  //
  const [destinationNewTokenAccount] = await web3.PublicKey.findProgramAddress(
    [
      destinationAddress.toBuffer(),
      spl.TOKEN_2022_PROGRAM_ID.toBuffer(),
      newToken.toBuffer(),
    ],
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
  )
  log(`Holder's new token account: ${destinationNewTokenAccount}`)

  /// Holder ATA calculation
  //
  const [holderATA] = await web3.PublicKey.findProgramAddress(
    [holder.toBuffer(), spl.TOKEN_PROGRAM_ID.toBuffer(), oldToken.toBuffer()],
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  /// Calculating minimal rent
  //
  const mintAccountRentExtemption =
    await spl.getMinimumBalanceForRentExemptAccount(connection)

  let instructions = [
    // Creating temporary account for the old mint
    web3.SystemProgram.createAccount({
      fromPubkey: holder,
      newAccountPubkey: anciliaryAccountKeypair.publicKey,
      lamports: mintAccountRentExtemption,
      space: spl.ACCOUNT_SIZE,
      programId: spl.TOKEN_PROGRAM_ID,
    }),
    // Initializing anciliary account
    spl.createInitializeAccountInstruction(
      anciliaryAccountKeypair.publicKey,
      oldToken,
      holder,
    ),
    // Transfering old mint to anciliary
    spl.createTransferInstruction(
      holderATA,
      anciliaryAccountKeypair.publicKey,
      holder,
      amount * Math.pow(10, originalMint.decimals),
    ),
    // Create associated account if needed
    spl.createAssociatedTokenAccountIdempotentInstruction(
      holder,
      destinationNewTokenAccount,
      destinationOwner,
      newToken,
      spl.TOKEN_2022_PROGRAM_ID,
    ),
    // Upgrade instruction
    createUpgradeTokenInstruction(
      anciliaryAccountKeypair.publicKey,
      oldToken,
      escrow,
      destinationNewTokenAccount,
      newToken,
      holder,
      upgradeProgramId,
    ),
    // Close anciliary token account
    spl.createCloseAccountInstruction(
      anciliaryAccountKeypair.publicKey,
      holder,
      holder,
    ),
  ]

  const exchangeTx = new web3.Transaction().add(...instructions)

  return [exchangeTx, [anciliaryAccountKeypair]]
}

export function createUpgradeTokenInstruction(
  originalAccount: web3.PublicKey,
  originalMint: web3.PublicKey,
  newEscrow: web3.PublicKey,
  newAccount: web3.PublicKey,
  newMint: web3.PublicKey,
  originalTransferAuthority: web3.PublicKey,
  programId: web3.PublicKey,
  originalMultisigSigners: (web3.Signer | web3.PublicKey)[] = [],
  originalTokenProgramId: web3.PublicKey = spl.TOKEN_PROGRAM_ID,
  newTokenProgramId: web3.PublicKey = spl.TOKEN_2022_PROGRAM_ID,
) {
  const [escrowAuthority] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("token-escrow-authority"),
      originalMint.toBuffer(),
      newMint.toBuffer(),
    ],
    programId,
  )

  log(`Escrow authority: ${escrowAuthority}`)

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
