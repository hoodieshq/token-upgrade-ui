#!/bin/env node
import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { homedir } from "node:os";
import { keypairFromJSON, spawnSubcommandSync, withSleep } from "./utils.mjs";
import {
  sendAndConfirmTransaction,
  fromUiAmount,
} from "@solana/token-upgrade-ui";

type Owner = {
  payer: web3.Keypair;
  publicKey: web3.PublicKey;
};

const CLUSTER_URL = process.env.CLUSTER_URL;
const CLUSTER_MONIKER = (process.env.CLUSTER_MONIKER ??
  "devnet") as web3.Cluster;
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS ?? `${homedir()}/.config/solana/id.json`;
const SOLANA_TOKEN_UPGRADE_CLI =
  process.env.SOLANA_TOKEN_UPGRADE_CLI ?? "spl-token-upgrade";

if (!WALLET_ADDRESS) throw new Error("Absent wallet");

const connection = new web3.Connection(
  CLUSTER_URL || web3.clusterApiUrl(CLUSTER_MONIKER),
  "confirmed",
);

const [_node, _script, holderAddress, tokenAmount, tokenDecimals] =
  process.argv;
console.debug("Arguments:", {
  clusterUrl: connection.rpcEndpoint,
  holderAddress,
  tokenAmount,
  tokenDecimals,
});

async function issueTokens(
  holderAddress: string,
  amount = "1",
  decimals = "9",
) {
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

  const mint2022Keypair = web3.Keypair.generate();
  const mint2022 = mint2022Keypair.publicKey;

  const mintLen = spl.getMintLen([spl.ExtensionType.PermanentDelegate]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const createAccountInstruction = web3.SystemProgram.createAccount({
    fromPubkey: owner.payer.publicKey,
    newAccountPubkey: mint2022,
    space: mintLen,
    lamports,
    programId: spl.TOKEN_2022_PROGRAM_ID,
  });
  const initializePermanentDelegateInstruction =
    spl.createInitializePermanentDelegateInstruction(
      mint2022,
      owner.publicKey,
      spl.TOKEN_2022_PROGRAM_ID,
    );
  const initializeMintInstruction = spl.createInitializeMintInstruction(
    mint2022,
    Number(decimals),
    owner.publicKey,
    owner.publicKey,
    spl.TOKEN_2022_PROGRAM_ID,
  );
  const tx = new web3.Transaction().add(
    createAccountInstruction,
    initializePermanentDelegateInstruction,
    initializeMintInstruction,
  )
  //tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  //tx.feePayer = owner.publicKey
  //tx.partialSign(owner.payer)
  //tx.sign(mint2022Keypair)
  await withSleep(
    sendAndConfirmTransaction(
      connection,
      tx, 
      owner.publicKey,
      [owner.payer, mint2022Keypair]
    ),
    "Creating mint",
  );

  /*
   *const mint2022 = await withSleep(
   *  await spl.createMint(
   *    connection,
   *    owner.payer,
   *    owner.publicKey,
   *    owner.publicKey,
   *    Number(decimals),
   *    undefined,
   *    undefined,
   *    spl.TOKEN_2022_PROGRAM_ID,
   *  ),
   *  "Creating mint",
   *);
   */
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
      fromUiAmount(Number(amount), Number(decimals)),
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
          fromUiAmount(Number(amount), Number(decimals)),
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

  return `Use these variables: "NEXT_PUBLIC_ORIGIN_TOKEN_ADDRESS=${mint}\r\nNEXT_PUBLIC_TARGET_TOKEN_ADDRESS=${mint2022}\r\nNEXT_PUBLIC_ESCROW_AUTHY_ADDRESS=${escrowAccount}"`;
}

issueTokens(holderAddress, tokenAmount, tokenDecimals).then(
  console.log.bind(console),
);
