"use client"
import * as web3 from "@solana/web3.js"
import { airdropToken, createTokens } from "../entities/index"
import { Button, TokenUpgrade } from "@solana/token-upgrade-ui"
import { Pattern } from "../shared/pattern"
import { TOKEN_ADDRESS } from "../env"
import { useCallback, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export default function Home() {
  const { connection } = useConnection()
  const { wallet } = useWallet()

  const [owner, setOwner] = useState<{
    payer: web3.Keypair
    publicKey: web3.PublicKey
  }>()
  const [token, setToken] = useState<web3.PublicKey>()

  const onAirdrop = useCallback(async () => {
    if (!owner) return console.error("Absent owner")
    if (!token) return console.error("Absent token")
    console.log("Airdrop 1 token...")
    await airdropToken(connection, token, owner)
    console.log("Successfully airdroped")
  }, [connection, owner])

  const onCreate = useCallback(async () => {
    if (!wallet) return console.error("Absent wallet")
    console.log("Create tokens...")
    const { owner, oldToken } = await createTokens(connection, wallet)
    setOwner(owner)
    setToken(oldToken)
    console.log("Successfully created")
  }, [connection])

  return (
    <>
      <Pattern />
      <div className="prose py-2 dark:prose-invert">
        <div className="container flex justify-center">
          <TokenUpgrade tokenAddress={TOKEN_ADDRESS} />
        </div>
      </div>
      <div className="container flex justify-center gap-4 py-2">
        <Button onClick={onCreate}>Create tokens</Button>
        <Button onClick={onAirdrop}>Airdrop 1 token</Button>
      </div>
      <div className="container flex justify-center py-2 text-white">
        <pre>Connected to the {connection.rpcEndpoint}.</pre>
      </div>
      <div className="container flex justify-center py-2 text-white">
        <pre>See additional logging at the console</pre>
      </div>
    </>
  )
}
