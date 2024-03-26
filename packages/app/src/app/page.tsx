"use client"
import { TokenUpgrade, useNotificationContext } from "@solana/token-upgrade-ui"
import { Pattern } from "../shared/pattern"
import { TOKEN_UPGRADE_PROGRAM_ID } from "../env"
import { useCallback, useEffect, useState } from "react"
import ChangeCluster from "../features/change-cluster"
import Input from "../shared/input"
import * as web3 from "@solana/web3.js"

export default function Home() {
  const { setNotification } = useNotificationContext()

  const _log = useCallback(
    (msg: string) => {
      setNotification({ message: msg })
      globalThis.console.log(msg)
    },
    [setNotification],
  )

  const [token, setToken] = useState<web3.PublicKey>()
  const [tokenExt, setTokenExt] = useState<web3.PublicKey>()
  const [escrow, setEscrow] = useState<web3.PublicKey>()

  useEffect(() => {
    const url = new URLSearchParams(globalThis.location.search)
    console.log(url.get("token"), url.get("tokenExt"), url.get("escrow"))

    const t = url.get("token")
    const te = url.get("tokenExt")
    const e = url.get("escrow")
    if (t) setToken(new web3.PublicKey(t))
    if (te) setTokenExt(new web3.PublicKey(te))
    if (e) setEscrow(new web3.PublicKey(e))
  }, [])

  return (
    <>
      <Pattern />
      <div className="prose py-2 dark:prose-invert">
        <div className="container flex justify-center">
          <TokenUpgrade
            escrow={escrow?.toString()}
            onUpgradeStart={() => _log("Upgrading token")}
            onUpgradeEnd={({ signature }) =>
              setNotification({
                message: "Token upgraded",
                link: `https://explorer.solana.com/tx/${signature}`,
              })
            }
            onUpgradeError={(error) =>
              _log(`Error: ${error.message || error.name}`)
            }
            tokenAddress={token?.toString()}
            tokenExtAddress={tokenExt?.toString()}
            tokenUpgradeProgramId={TOKEN_UPGRADE_PROGRAM_ID}
          />
        </div>
      </div>

      <div className="light:text-black dark:text-white">
        <div className="container flex flex-col items-center justify-center py-2">
          <div className="min-w-80 pb-1.5 pt-2.5">
            <Input
              defaultValue={token?.toString()}
              name="tokenAddress"
              label="Token address"
              onChange={(e) => {
                setToken(new web3.PublicKey(e.target.value.trim()))
              }}
              placeholder="Paste here token address to update"
            />
          </div>
          <div className="min-w-80 pb-1.5 pt-2.5">
            <Input
              defaultValue={tokenExt?.toString()}
              name="token2022Address"
              label="Token Extension address"
              onChange={(e) => {
                setTokenExt(new web3.PublicKey(e.target.value.trim()))
              }}
              placeholder="Paste here token address to update"
            />
          </div>
          <div className="min-w-80 pb-1.5 pt-2.5">
            <Input
              defaultValue={escrow?.toString()}
              name="escrow"
              label="Escrow address"
              onChange={(e) => {
                setEscrow(new web3.PublicKey(e.target.value.trim()))
              }}
              placeholder="Paste here token address to update"
            />
          </div>
          <ChangeCluster className="min-w-80 pb-1.5 pt-2.5" />
        </div>
      </div>
    </>
  )
}
