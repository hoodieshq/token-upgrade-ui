import type { ParsedAccountData } from "@solana/web3.js"
import {
  any,
  boolean,
  Describe,
  Infer,
  number,
  object,
  optional,
  string,
  type,
} from "superstruct"

const ParsedAccountData: Describe<ParsedAccountData> = object({
  program: string(),
  parsed: object(),
  space: number(),
})

export type ParsedAccountInfo = Infer<typeof ParsedAccountInfo>
export const ParsedAccountInfo = type({
  data: ParsedAccountData,
  executable: boolean(),
  lamports: number(),
  owner: any(),
  recentEpoch: optional(number()),
  space: number(),
})
