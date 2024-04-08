import dynamic from "next/dynamic"
import * as web3 from "@solana/web3.js"
import {
  ORIGIN_TOKEN_ADDRESS,
  TARGET_TOKEN_ADDRESS,
  ESCROW_AUTHY_ADDRESS,
} from "../env"

function checkConfiguration() {
  const isValidAddr = (a?: string) => {
    return Boolean(a) && a ? Boolean(new web3.PublicKey(a)) : false
  }

  return (
    isValidAddr(ORIGIN_TOKEN_ADDRESS) &&
    isValidAddr(TARGET_TOKEN_ADDRESS) &&
    isValidAddr(ESCROW_AUTHY_ADDRESS)
  )
}

const NoSSRIndexEntrie = dynamic(() => import("../entries/index"), {
  ssr: false,
})

export default function Home() {
  if (!checkConfiguration()) {
    throw new Error(
      "Application is not configured correctly. Please provide valid token addresses. See the project README for more information.",
    )
  }

  return <NoSSRIndexEntrie />
}
