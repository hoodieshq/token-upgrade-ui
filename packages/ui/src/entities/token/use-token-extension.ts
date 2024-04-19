import * as web3 from "@solana/web3.js"
import {
  keepPreviousData,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query"
import { useConnection } from "@solana/wallet-adapter-react"
import { create } from "superstruct"
import {
  MintAccountInfo,
  ParsedAccountInfo,
  TokenAccount,
  TokenExtension,
} from "./validators"

export type TokenExtensionList = TokenExtension[] | undefined

const empty: TokenExtensionList = undefined

export { empty as placeholderData }

export function useTokenExtension(
  address: web3.PublicKey | string | undefined,
  opts?: Pick<
    QueryObserverOptions<TokenExtensionList>,
    "refetchInterval" | "refetchIntervalInBackground" | "placeholderData"
  >,
) {
  const { connection } = useConnection()

  const {
    data: extensions,
    error,
    ...other
  } = useQuery({
    enabled: Boolean(address),
    placeholderData: opts?.placeholderData || keepPreviousData,
    queryFn: async (): Promise<TokenExtensionList> => {
      // no token selected yet
      if (!address) {
        return empty
      }

      if (typeof address === "string") {
        address = new web3.PublicKey(address)
      }

      /// Assume that there will be only one account to simplify handling
      const { value: parsedAccounts } =
        await connection.getMultipleParsedAccounts([address])
      const [parsedAccount] = parsedAccounts
      const tokenAccountInfo = create(parsedAccount, ParsedAccountInfo)
      const parsedInfo = create(tokenAccountInfo.data.parsed, TokenAccount)

      const mintAccountInfo = create(parsedInfo.info, MintAccountInfo)

      // Return empty list on absent extensions
      return mintAccountInfo.extensions ?? []
    },
    queryKey: ["useTokenExtensionList", String(address)],
    refetchInterval: opts?.refetchInterval ?? 60_000,
    refetchIntervalInBackground: opts?.refetchIntervalInBackground,
  })

  return { extensions, error, ...other }
}
