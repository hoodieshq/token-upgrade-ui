import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { Wallet } from "@solana/wallet-adapter-react";
import { resolve } from "node:path";
import { homedir } from "node:os";
import { keypairFromJSON, withSleep } from "./utils.mjs";

const CLUSTER_MONIKER = (process.env.CLUSTER_MONIKER ??
  "devnet") as web3.Cluster;
const TOKEN_UPGRADE_PROGRAM_ID = process.env.TOKEN_UPGRADE_PROGRAM_ID;
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS ?? `${homedir()}/.config/solana/id.json`;

type Owner = {
  payer: web3.Keypair;
  publicKey: web3.PublicKey;
};

if (!TOKEN_UPGRADE_PROGRAM_ID) throw new Error("Absent upgrade program id");

const connection = new web3.Connection(web3.clusterApiUrl(CLUSTER_MONIKER), "confirmed");

async function issueTokens(amount = 1, decimals = 9) {
  const payer = keypairFromJSON(WALLET_ADDRESS);
  const owner: Owner = {
    payer,
    publicKey: payer.publicKey,
  };

  const mint = await withSleep(
    await spl.createMint(
      connection,
      owner.payer,
      owner.publicKey,
      owner.publicKey,
      decimals,
    ),
    "Creating mint",
  );
  console.log(`Mint created: ${mint}`);

  const token = await spl.getOrCreateAssociatedTokenAccount(connection, owner.payer, mint, owner.publicKey);

  console.log(await connection.getAccountInfo(token.address))

  //const tokenATA = await withSleep(

  //"Creating ATA to hold the mint",
  //);
  //console.log("Token ATA created");
  //console.log(await spl.getMint(connection, token))
}

issueTokens().then(console.log.bind(console, "Completed."));
