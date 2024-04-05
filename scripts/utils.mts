import * as web3 from "@solana/web3.js";
//@ts-ignore
import childProcess from "node:child_process";
//@ts-ignore
import fs from "node:fs";
//@ts-ignore
import path from "node:path";

function readJSONSync(pathToFile: string) {
  const pathToJSON = path.resolve(pathToFile);
  const buffer = fs.readFileSync(pathToJSON, "utf8");
  return buffer;
}

function readAsUInt8(bufferString: string) {
  return Uint8Array.from(JSON.parse(bufferString));
}

export function readJSON(path: string) {
  return readAsUInt8(readJSONSync(path));
}

export function keypairFromJSON(path: string) {
  return web3.Keypair.fromSecretKey(readJSON(path));
}

async function sleep(t = 750) {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, t);
  });
}

export async function withSleep<T>(promise: T, message?: string) {
  if (message) console.log(message);
  const result = await promise;
  await sleep();
  return result;
}

export function spawnSubcommandSync(command: string, _args?: string[]) {
  const result = childProcess.spawnSync(command, { shell: true });

  const { status, stderr, stdout } = result;

  if (stderr.length > 0 || status !== 0) {
    console.error(stderr.toString());
    process.exit(1);
  }

  // console.log("|>", stdout.toString());

  return [status, stdout.toString()];
}
