#!/bin/env node
import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { homedir } from "node:os";
import {
  keypairFromJSON,
  sendAndConfirmTransaction,
  spawnSubcommandSync,
  uiAmount,
  withSleep,
} from "./utils.mjs";

type Owner = {
  payer: web3.Keypair;
  publicKey: web3.PublicKey;
};

const CLUSTER_MONIKER = (process.env.CLUSTER_MONIKER ??
  "devnet") as web3.Cluster;
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS ?? `${homedir()}/.config/solana/id.json`;
const SOLANA_TOKEN_UPGRADE_CLI = process.env.SOLANA_TOKEN_UPGRADE_CLI ?? "spl-token-upgrade"

if (!WALLET_ADDRESS) throw new Error("Absent wallet");

const connection = new web3.Connection(
  web3.clusterApiUrl(CLUSTER_MONIKER),
  "confirmed",
);

const [_node, _script, holderAddress, tokenAmount, tokenDecimals] =
  process.argv;
console.debug("Arguments:", { holderAddress, tokenAmount, tokenDecimals });

async function issueTokens(holderAddress: string, amount = "1", decimals = "9") {
  const payer = keypairFromJSON(WALLET_ADDRESS);
  const owner: Owner = {
    payer,
    publicKey: payer.publicKey,
  };

  const holder = new web3.PublicKey(holderAddress);

  const mint = await withSleep(
    await spl.createMint(
      connection,
      owner.payer,
      owner.publicKey,
      owner.publicKey,
      Number(decimals),
    ),
    "Creating mint",
  );
  console.log(`Mint created: ${mint}`);

  const token = await withSleep(
    await spl.getOrCreateAssociatedTokenAccount(
      connection,
      owner.payer,
      mint,
      owner.publicKey,
    ),
    "Creating ATA to hold the mint",
  );
  console.log(`Token Account ${token.address} created`);

  const mint2022 = await withSleep(
    await spl.createMint(
      connection,
      owner.payer,
      owner.publicKey,
      owner.publicKey,
      Number(decimals),
      undefined,
      undefined,
      spl.TOKEN_2022_PROGRAM_ID,
    ),
    "Creating mint",
  );
  console.log(`Mint created: ${mint2022}`);

  const token2022 = await withSleep(
    await spl.getOrCreateAssociatedTokenAccount(
      connection,
      owner.payer,
      mint2022,
      owner.publicKey,
      undefined,
      undefined,
      undefined,
      spl.TOKEN_2022_PROGRAM_ID,
    ),
    "Creating ATA to hold the mint",
  );
  console.log(`Token-2022 Account ${token2022.address} created`);

  /// Minting
  //
  const holderAccount = await withSleep(
    await spl.getOrCreateAssociatedTokenAccount(
      connection,
      owner.payer,
      mint,
      holder,
    ),
    "Creating account for holder to store the token",
  );
  console.log("Holder account created");

  const minted = await withSleep(
    await spl.mintTo(
      connection,
      owner.payer,
      token.mint,
      holderAccount.address,
      owner.publicKey,
      uiAmount(amount, decimals),
    ),
    `Minting ${amount} of ${token.mint} to ${holderAccount.address}`,
  );
  console.log("Token minted:", minted);

  /// Creating escrow account for upgrade purposes
  //
  const [, createEscrowResp] = spawnSubcommandSync(
    `${SOLANA_TOKEN_UPGRADE_CLI} -u ${connection.rpcEndpoint} create-escrow ${token.mint} ${token2022.mint}`,
  );
  const escrowAccount = new web3.PublicKey(
    (createEscrowResp as string).split(" ")[3],
  );
  console.log(`Escrow account created: ${escrowAccount}`);

  const sendedToEscrow = await withSleep(
    await sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(
        spl.createMintToInstruction(
          token2022.mint,
          escrowAccount,
          owner.publicKey,
          uiAmount(amount, decimals),
          undefined,
          spl.TOKEN_2022_PROGRAM_ID,
        ),
      ),
      owner.publicKey,
      [owner.payer],
    ),
    `Minting ${amount} of ${token2022.mint} to escrow`,
  );
  console.log("Token minted to escrow:", sendedToEscrow);

  console.log(`Success. ${token.mint} is eligible for upgrade.`);

  return `Use this query string for demonstration: "?token=${mint}&tokenExt=${mint2022}&escrow=${escrowAccount}"`;
}

issueTokens(holderAddress, tokenAmount, tokenDecimals).then(
  console.log.bind(console, "Issue tokens."),
);
