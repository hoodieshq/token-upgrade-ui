import * as web3 from "@solana/web3.js"
import ChangeCluster from "../features/change-cluster"
import { Pattern } from "../shared/pattern"
import {
  TOKEN_UPGRADE_PROGRAM_ID,
  ORIGIN_TOKEN_ADDRESS,
  TARGET_TOKEN_ADDRESS,
  ESCROW_AUTHY_ADDRESS,
} from "../env"
import { TokenUpgrade, useNotificationContext } from "@solana/token-upgrade-ui"
import { useCallback } from "react"
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

  return (
    <>
      <Pattern />
      <div className="prose flex justify-center py-2 dark:prose-invert">
        <div className="container max-w-[440px]">
          <TokenUpgrade
            escrow={ESCROW_AUTHY_ADDRESS}
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
            tokenAddress={ORIGIN_TOKEN_ADDRESS}
            tokenExtAddress={TARGET_TOKEN_ADDRESS}
            tokenUpgradeProgramId={TOKEN_UPGRADE_PROGRAM_ID}
          />
        </div>
      </div>

      <div className="light:text-black prose flex justify-center py-2 dark:prose-invert dark:text-white">
        <div className="container flex max-w-[440px] flex-col items-center justify-center py-2">
          <ChangeCluster className="min-w-80 pb-1.5 pt-2.5" />
        </div>
      </div>
    </>
  )
}
