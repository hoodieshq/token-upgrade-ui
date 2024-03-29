import * as web3 from "@solana/web3.js"
import ChangeCluster from "../features/change-cluster"
import Input from "../shared/input"
import { Pattern } from "../shared/pattern"
import { TOKEN_UPGRADE_PROGRAM_ID } from "../env"
import { TokenUpgrade, useNotificationContext } from "@solana/token-upgrade-ui"
import { useCallback, useEffect, useState } from "react"
import { useConnection } from "@solana/wallet-adapter-react"

function getCluster(rpc: string) {
  function getMoniker(s: string): web3.Cluster | "custom" {
    if (s === web3.clusterApiUrl("devnet")) return "devnet"
    if (s === web3.clusterApiUrl("mainnet-beta")) return "mainnet-beta"
    if (s === web3.clusterApiUrl("testnet")) return "testnet"
    return "custom"
  }
  return getMoniker(rpc)
}

function setPublicKey(publicKey: string) {
  let pk
  try {
    pk = new web3.PublicKey(publicKey)
  } catch (e: unknown) {
    return null
  }
  return pk
}

export default function IndexPage() {
  const { connection } = useConnection()
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
      <div className="prose flex justify-center py-2 dark:prose-invert">
        <div className="container max-w-[440px]">
          <TokenUpgrade
            escrow={escrow?.toString()}
            onUpgradeStart={() => _log("Upgrading token")}
            onUpgradeEnd={({ signature }) =>
              setNotification({
                message: "Token upgraded",
                link: `https://explorer.solana.com/tx/${signature}?cluster=${getCluster(connection.rpcEndpoint)}`,
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
                const pk = setPublicKey(e.target.value.trim())
                if (pk === null) {
                  setNotification({ message: "Invalid address" })
                } else {
                  setToken(pk)
                }
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
                const pk = setPublicKey(e.target.value.trim())
                if (pk === null) {
                  setNotification({ message: "Invalid address" })
                } else {
                  setTokenExt(pk)
                }
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
                const pk = setPublicKey(e.target.value.trim())
                if (pk === null) {
                  setNotification({ message: "Invalid address" })
                } else {
                  setEscrow(pk)
                }
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
