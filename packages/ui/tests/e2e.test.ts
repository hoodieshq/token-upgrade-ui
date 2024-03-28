//import BN from "bn.js";
import * as web3 from "@solana/web3.js";
// import * as spl from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import test from "ava";
import { homedir } from "node:os"
import { upgradeToken } from "../src/entities/upgrade/index"

const SOLANA_TOKEN_UPGRADE_CLI = process.env.SOLANA_TOKEN_UPGRADE_CLI ?? "spl-token-upgrade"
const TOKEN_UPGRADE_PROGRAM_ID = process.env.TOKEN_UPGRADE_PROGRAM_ID ?? "GHscxHuEzVwEiEqu2WQ9FLww72hQzYxhVp3i2ncJJp5"
const WALLET_ADDRESS = process.env.WALLET_ADDRESS ?? `${homedir()}/.config/solana/id.json`;

test("should upgrade token", async (t: any) => {
  anchor.setProvider(anchor.AnchorProvider.env());
  // init cluster

  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))

  const holder = web3.Keypair.generate()
  const oldToken = web3.Keypair.generate()
  const newToken = web3.Keypair.generate()
  const


  console.log(await connection.getBalance(holder.publicKey))

  const upgrade = await upgradeToken(
    connection,
    holder.publicKey,


  )

  console.log(upgrade)


  t.pass()
})
