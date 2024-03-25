"use client"
import * as web3 from "@solana/web3.js"
import { TokenUpgrade, useNotificationContext } from "@solana/token-upgrade-ui"
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

  const [token, setToken] = useState<web3.PublicKey>()

  return (
    <>
      <Pattern />
      <div className="prose py-2 dark:prose-invert">
        <div className="container flex justify-center">
          <TokenUpgrade
            onUpgradeStart={() => _log("Upgrading token")}
            onUpgradeEnd={({ signature }) =>
              setNotification({
                message: "Token upgraded",
                link: `https://explorer.solana.com/tx/${signature}`,
              })
            }
            onUpgradeError={(error) => _log(`Error: ${error.message}`)}
            tokenAddress={token?.toString()}
          />
        </div>
      </div>

      <div className="light:text-black dark:text-white">
        <div className="container flex flex-col items-center justify-center py-2">
          <div className="min-w-80 pb-1.5 pt-2.5">
            <Input
              name="tokenAddress"
              onChange={(e) => {
                setToken(new web3.PublicKey(e.target.value.trim()))
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
