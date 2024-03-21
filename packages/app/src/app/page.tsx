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
  const [oldToken, setOldToken] = useState<web3.PublicKey>()
  const [newToken, setNewToken] = useState<web3.PublicKey>()

  const onCreate = useCallback(async () => {
    if (!wallet) return console.error("Absent wallet")
    console.log("Create tokens...")
    const {
      owner,
      oldToken: o,
      newToken: n,
    } = await createTokens(connection, wallet)
    setOwner(owner)
    setOldToken(o)
    setNewToken(n)
    console.log("Successfully created")
  }, [connection, wallet])

  const onAirdrop = useCallback(async () => {
    if (!owner) return console.error("Absent owner")
    if (!oldToken) return console.error("Absent token")
    if (!wallet) return console.error("Absent wallet")
    console.log("Airdrop 1 token...")
    await airdropToken(connection, oldToken, owner, wallet)
    console.log("Successfully airdroped")
  }, [connection, wallet, owner, oldToken])

  return (
    <>
      <Pattern />
      <div className="prose py-2 dark:prose-invert">
        <div className="container flex justify-center">
          <TokenUpgrade tokenAddress={oldToken?.toString()} />
        </div>
      </div>
      <div className="container flex justify-center gap-4 py-2">
        <Button onClick={onCreate}>Create tokens</Button>
        <Button onClick={onAirdrop}>Airdrop 1 token</Button>
      </div>
      <div className="light:text-white container flex justify-center py-2 dark:text-black">
        <pre>Connected to the {connection.rpcEndpoint}.</pre>
      </div>
      <div className="light:text-white container flex justify-center py-2 dark:text-black">
        <pre>See additional logging at the console</pre>
      </div>
      {oldToken && newToken ? (
        <div className="align-center light:text-white align-center container flex flex-col justify-center py-2 dark:text-black">
          Execute command at the terminal to create escrow account:
          <pre className="w-[100%] text-center">
            <textarea
              className="h-[20vh] w-[55vw] overflow-hidden border-none text-sm"
              value={`spl-token-upgrade create-escrow ${oldToken.toString()} ${newToken.toString()}`}
            />
          </pre>
        </div>
      ) : null}
    </>
  )
}
