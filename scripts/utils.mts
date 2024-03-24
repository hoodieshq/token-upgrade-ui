import fs from "node:fs";
import path from "node:path";
import * as web3 from "@solana/web3.js";

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

export async function sleep(t = 1500) {
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
