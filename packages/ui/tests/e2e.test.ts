import * as anchor from "@project-serum/anchor"
import * as spl from "@solana/spl-token"
import * as web3 from "@solana/web3.js"
import Debug from "debug"
import { expect, test } from "vitest"
import { homedir } from "node:os"
import {
  keypairFromJSON,
  spawnSubcommandSync,
  withSleep,
} from "../../../scripts/utils.mjs" // note: it's bad to import smth from outside of package, but leave it be
import { upgradeToken } from "../src/entities/upgrade/index"
import {
  enrichTxWithRecentInfo,
  fromUiAmount,
  sendAndConfirmTransaction,
} from "../src/entities/transaction"

/**
 *  Token Upgrade flow
 *
 *  Prerequisites:
 *  - Instance of "token-upgrade" program at the cluster
 *  - ["spl-token-program"](https://github.com/solana-labs/solana-program-library/tree/master/token-upgrade/cli) should use correct token-upgrade program's address
 *  - Wallet with enough SOL. Scenario will use default `id.json` wallet. You can airdrop ([one]https://spl.solana.com/token#airdrop-solu(https://spl.solana.com/token#airdrop-sol), [two](https://solana.com/developers/guides/getstarted/solana-token-airdrop-and-faucets#1-solana-airdrop)) some SOL on devent or testnet.
 *
 *  Example:
 *  ```sh
 *  $ ls -d *
 *  solana-program-library    token-upgade-ui
 *
    $ SOLANA_TOKEN_UPGRADE_CLI=$(pwd)/../solana-program-library/target/debug/spl-token-upgrade\
     TOKEN_UPGRADE_PROGRAM_ID=GHscxHuEzVwEiEqu2WQ9FLww72hQzYxhVp3i2ncJJp5\
     pnpm --filter "@solana/*ui" local:test-e2e
 *  ```
 */

const log = Debug("debug:token-upgrade-ui:e2e")

const CLUSTER_URL = process.env.CLUSTER_URL
const SOLANA_TOKEN_UPGRADE_CLI =
  process.env.SOLANA_TOKEN_UPGRADE_CLI ?? "spl-token-upgrade"
const TOKEN_UPGRADE_PROGRAM_ID = process.env.TOKEN_UPGRADE_PROGRAM_ID
const WALLET_JSON_PATH =
  process.env.WALLET_JSON_PATH ?? `${homedir()}/.config/solana/id.json`

type Owner = {
  payer: web3.Keypair
  publicKey: web3.PublicKey
}

function toOwner(payer: web3.Keypair): Owner {
  return { payer, publicKey: payer.publicKey }
}

function initEnvironment() {
  /// prevent to initialize the environment for tests
  //  been run with custom cluster instance
  if (!CLUSTER_URL) {
    anchor.setProvider(anchor.AnchorProvider.env())
  }
}

function getConnection(
  moniker: web3.Cluster,
  commitment: web3.Commitment = "confirmed",
) {
  const endpoint = CLUSTER_URL || web3.clusterApiUrl(moniker)

  log(`Establish connection to ${endpoint}`)

  const connection = new web3.Connection(endpoint, commitment)

  return connection
}

async function transferToken(
  connection: web3.Connection,
  owner: Owner,
  holder: Owner,
) {
  /// Transfering some SOL to holder
  const sig = await sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: owner.publicKey,
        toPubkey: holder.publicKey,
        lamports: web3.LAMPORTS_PER_SOL / 10,
      }),
    ),
    owner.publicKey,
    [owner.payer],
  )

  return sig
}

async function premintTokens(
  connection: web3.Connection,
  owner: Owner,
  ho1dr: Owner,
  amount: number,
  decimals: number,
) {
  if (!SOLANA_TOKEN_UPGRADE_CLI)
    throw new Error("SOLANA_TOKEN_UPGRADE_CLI is not set")
  if (!TOKEN_UPGRADE_PROGRAM_ID)
    throw new Error("TOKEN_UPGRADE_PROGRAM_ID is not set")

  log("%O", { SOLANA_TOKEN_UPGRADE_CLI, TOKEN_UPGRADE_PROGRAM_ID })

  const { publicKey: holder } = ho1dr

  log(`Start upgrading ${amount} tokens for ${holder}`)

  const mint = await withSleep(
    await spl.createMint(
      connection,
      owner.payer,
      owner.publicKey,
      owner.publicKey,
      decimals,
    ),
  )
  const token = await withSleep(
    await spl.getOrCreateAssociatedTokenAccount(
      connection,
      owner.payer,
      mint,
      owner.publicKey,
    ),
  )

  const mintExt = await withSleep(
    await spl.createMint(
      connection,
      owner.payer,
      owner.publicKey,
      owner.publicKey,
      decimals,
      undefined,
      undefined,
      spl.TOKEN_2022_PROGRAM_ID,
    ),
  )
  const tokenExt = await withSleep(
    await spl.getOrCreateAssociatedTokenAccount(
      connection,
      owner.payer,
      mintExt,
      owner.publicKey,
      undefined,
      undefined,
      undefined,
      spl.TOKEN_2022_PROGRAM_ID,
    ),
  )

  const holderAccount = await withSleep(
    await spl.getOrCreateAssociatedTokenAccount(
      connection,
      owner.payer,
      mint,
      holder,
    ),
  )

  await withSleep(
    await spl.mintTo(
      connection,
      owner.payer,
      token.mint,
      holderAccount.address,
      owner.publicKey,
      amount,
    ),
  )

  const [, createEscrowStdout] = spawnSubcommandSync(
    `${SOLANA_TOKEN_UPGRADE_CLI} -u ${connection.rpcEndpoint} create-escrow ${token.mint} ${tokenExt.mint}`,
  )

  const escrowAccount = new web3.PublicKey(
    (createEscrowStdout as string).split(" ")[3],
  )

  await withSleep(
    await sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(
        spl.createMintToInstruction(
          tokenExt.mint,
          escrowAccount,
          owner.publicKey,
          amount,
          undefined,
          spl.TOKEN_2022_PROGRAM_ID,
        ),
      ),
      owner.publicKey,
      [owner.payer],
    ),
  )

  return {
    escrowAccount,
    holderAccount,
    token,
    tokenExt,
    tokenUpgradeProgramId: new web3.PublicKey(TOKEN_UPGRADE_PROGRAM_ID),
  }
}

test("should deny upgrading on insufficient amount of tokens", async () => {
  // init cluster
  initEnvironment()

  if (!WALLET_JSON_PATH) throw new Error("WALLET_JSON_PATH is not provider")

  const payer = keypairFromJSON(WALLET_JSON_PATH)
  const owner = toOwner(payer)

  const holder = web3.Keypair.generate()
  const ho1dr = toOwner(holder)

  const uiAmount = 0.000001
  const decimals = 9
  const moniker = "devnet"

  const connection = getConnection(moniker)

  await transferToken(connection, owner, ho1dr)

  const amount = fromUiAmount(uiAmount, decimals)
  const { token, tokenExt, escrowAccount, tokenUpgradeProgramId } =
    await premintTokens(connection, owner, ho1dr, amount, decimals)

  expect(() => {
    return upgradeToken(
      connection,
      holder.publicKey,
      token.mint,
      tokenExt.mint,
      escrowAccount,
      amount * 2, // Ask to update more than was minted
      tokenUpgradeProgramId,
    )
  }).rejects.toThrow(/Insufficient amount of token/)
})

test("should upgrade token partially", async () => {
  // init cluster
  initEnvironment()

  if (!WALLET_JSON_PATH) throw new Error("WALLET_JSON_PATH is not provider")

  const payer = keypairFromJSON(WALLET_JSON_PATH)
  const owner = toOwner(payer)

  const holder = web3.Keypair.generate()
  const ho1dr = toOwner(holder)

  const uiAmount = 0.000001
  const decimals = 9
  const moniker = "devnet"

  const connection = getConnection(moniker)

  await transferToken(connection, owner, ho1dr)

  const amount = fromUiAmount(uiAmount, decimals)
  const { token, tokenExt, escrowAccount, tokenUpgradeProgramId } =
    await premintTokens(connection, owner, ho1dr, amount, decimals)

  const upgrade = await upgradeToken(
    connection,
    holder.publicKey,
    token.mint,
    tokenExt.mint,
    escrowAccount,
    amount / 2,
    tokenUpgradeProgramId,
  )

  const [transaction, signers] = upgrade

  await enrichTxWithRecentInfo(connection, transaction, ho1dr.publicKey)

  transaction.sign(...signers)

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    ho1dr.publicKey,
    [ho1dr.payer, ...signers],
  )

  log(`Completed. Signature: ${signature}`)

  const holderTokenExtAccount = await spl.getAccount(
    connection,
    (
      await web3.PublicKey.findProgramAddress(
        [
          ho1dr.publicKey.toBuffer(),
          spl.TOKEN_2022_PROGRAM_ID.toBuffer(),
          tokenExt.mint.toBuffer(),
        ],
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      )
    )[0],
    undefined,
    spl.TOKEN_2022_PROGRAM_ID,
  )

  // Token account should contain proper amount of tokens
  expect(Number(holderTokenExtAccount.amount)).toEqual(500)

  // Anciliary account should be closed
  await expect(
    spl.getAccount(connection, signers[0].publicKey),
  ).rejects.toStrictEqual(new spl.TokenAccountNotFoundError())
})

test("should upgrade all the amount", async (t: any) => {
  // init cluster
  initEnvironment()

  if (!WALLET_JSON_PATH) throw new Error("WALLET_JSON_PATH is not provider")

  const payer = keypairFromJSON(WALLET_JSON_PATH)
  const owner = toOwner(payer)

  const holder = web3.Keypair.generate()
  const ho1dr = toOwner(holder)

  const uiAmount = 0.000001
  const decimals = 9
  const moniker = "devnet"

  const connection = getConnection(moniker)

  await transferToken(connection, owner, ho1dr)

  const amount = fromUiAmount(uiAmount, decimals)
  const {
    escrowAccount,
    holderAccount,
    token,
    tokenExt,
    tokenUpgradeProgramId,
  } = await premintTokens(connection, owner, ho1dr, amount, decimals)

  const upgrade = await upgradeToken(
    connection,
    holder.publicKey,
    token.mint,
    tokenExt.mint,
    escrowAccount,
    amount,
    tokenUpgradeProgramId,
  )

  const [transaction, signers] = upgrade

  await enrichTxWithRecentInfo(connection, transaction, ho1dr.publicKey)

  transaction.sign(...signers)

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    ho1dr.publicKey,
    [ho1dr.payer, ...signers],
  )

  log(`Completed. Signature: ${signature}`)

  const holderTokenExtAccount = await spl.getAccount(
    connection,
    (
      await web3.PublicKey.findProgramAddress(
        [
          ho1dr.publicKey.toBuffer(),
          spl.TOKEN_2022_PROGRAM_ID.toBuffer(),
          tokenExt.mint.toBuffer(),
        ],
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      )
    )[0],
    undefined,
    spl.TOKEN_2022_PROGRAM_ID,
  )

  // Token account should contain proper amount of tokens
  expect(Number(holderTokenExtAccount.amount)).toEqual(1000)

  // Anciliary account should be closed
  expect(() => {
    return spl.getAccount(connection, signers[0].publicKey)
  }).rejects.toStrictEqual(new spl.TokenAccountNotFoundError())

  // Original associated token account should be closed
  expect(() => {
    return spl.getAccount(connection, holderAccount.address)
  }).rejects.toStrictEqual(new spl.TokenAccountNotFoundError())
})
