import dynamic from "next/dynamic"
import * as web3 from "@solana/web3.js"
import {
  CLUSTER_URL,
  ORIGIN_TOKEN_ADDRESS,
  TARGET_TOKEN_ADDRESS,
  ESCROW_AUTHY_ADDRESS,
  TOKEN_UPGRADE_PROGRAM_ID,
} from "../env"

function guardConfiguration() {
  const isValidAddr = (a?: string) => {
    return Boolean(a) && a ? Boolean(new web3.PublicKey(a)) : false
  }

  return (
    Boolean(new URL(CLUSTER_URL ?? "")) &&
    isValidAddr(ORIGIN_TOKEN_ADDRESS) &&
    isValidAddr(TARGET_TOKEN_ADDRESS) &&
    isValidAddr(ESCROW_AUTHY_ADDRESS) &&
    isValidAddr(TOKEN_UPGRADE_PROGRAM_ID)
  )
}

const NoSSRIndexEntrie = dynamic(() => import("../entries/index"), {
  ssr: false,
})

export default function Home() {
  if (!guardConfiguration()) {
    throw new Error(
      "Application is not configured correctly. Please provide valid token addresses. See the project README for more information.",
    )
  }

  return <NoSSRIndexEntrie />
}
