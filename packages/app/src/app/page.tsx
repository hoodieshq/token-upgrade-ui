"use client"
import * as web3 from "@solana/web3.js"
import { airdropToken, createTokens } from "../entities/index"
import {
  Button,
  TokenUpgrade,
  useNotificationContext,
} from "@solana/token-upgrade-ui"
import { Pattern } from "../shared/pattern"
import { TOKEN_UPGRADE_PROGRAM_ID } from "../env"
import { useCallback, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import ChangeCluster from "../features/change-cluster"
import Input from "../shared/input"

export default function Home() {
  const { connection } = useConnection()
  const { setNotification } = useNotificationContext()
  const { wallet } = useWallet()

  const _log = useCallback(
    (msg: string) => {
      setNotification({ message: msg })
      globalThis.console.log(msg)
    },
    [setNotification],
  )

  const [owner, setOwner] = useState<{
    payer: web3.Keypair
    publicKey: web3.PublicKey
  }>()
  const [oldToken, setOldToken] = useState<web3.PublicKey>()
  const [newToken, setNewToken] = useState<web3.PublicKey>()
  const [escrow, setEscrow] = useState<web3.PublicKey>()

  const onCreate = useCallback(async () => {
    if (!wallet) return _log("Absent wallet")
    _log("Creating tokens...")
    const {
      owner,
      oldToken: o,
      newToken: n,
    } = await createTokens(connection, wallet, TOKEN_UPGRADE_PROGRAM_ID)
    setOwner(owner)
    setOldToken(o)
    setNewToken(n)
    _log("Created. Execute command displayed on the page in the terminal")
  }, [connection, _log, wallet])

  const onAirdrop = useCallback(async () => {
    if (!owner) return _log("Absent owner")
    if (!oldToken) return _log("Absent token")
    if (!wallet) return _log("Absent wallet")
    if (!newToken) return _log("Absent token-2022")
    if (!escrow) return _log("Absent escrow")
    _log("Airdroping 1 token...")
    await airdropToken(connection, oldToken, newToken, escrow, owner, wallet)
    _log("Successfully airdroped")
  }, [connection, wallet, owner, oldToken, newToken, escrow, _log])

  return (
    <>
      <Pattern />
      <div className="prose py-2 dark:prose-invert">
        <div className="container flex justify-center">
          <TokenUpgrade tokenAddress={oldToken?.toString()} />
        </div>
      </div>

      <div className="light:text-black dark:text-white">
        <div className="container flex justify-center gap-4 py-2">
          <Button onClick={onCreate}>Create tokens</Button>
          <Button onClick={onAirdrop} disabled={!Boolean(escrow)}>
            Airdrop 1 token
          </Button>
        </div>

        <div className="container flex flex-col items-center justify-center py-2">
          <ChangeCluster className="min-w-80 pb-1.5 pt-2.5" />
          <div className="min-w-80 pb-1.5 pt-2.5">
            <Input
              name="escrowAddress"
              onChange={(e) => {
                setEscrow(new web3.PublicKey(e.target.value.trim()))
              }}
              placeholder="Paste here escrow address"
            />
          </div>
        </div>

        {oldToken && newToken ? (
          <div className="container mt-2 flex flex-col items-center justify-center py-2 font-mono">
            <label
              htmlFor="command"
              className="block w-80 text-xs font-medium leading-6 text-gray-900"
            >
              Execute command at the terminal to create escrow account:
            </label>
            <div className="mt-2">
              <textarea
                className="block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                id="command"
                name="command"
                readOnly
                rows={6}
                value={`spl-token-upgrade create-escrow ${oldToken.toString()} ${newToken.toString()}`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
