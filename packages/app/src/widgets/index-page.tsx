import * as web3 from "@solana/web3.js"
import {
  ESCROW_AUTHY_ADDRESS,
  EXPLORER_URL,
  ORIGIN_TOKEN_ADDRESS,
  TARGET_TOKEN_ADDRESS,
  TOKEN_UPGRADE_PROGRAM_ID,
} from "../env"
import {
  getCluster,
  TokenUpgrade,
  useNotificationContext,
} from "@solana/token-upgrade-ui"
import { Pattern } from "../shared/pattern"
import { useCallback } from "react"
import { useConnection } from "@solana/wallet-adapter-react"

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
            explorerUrl={EXPLORER_URL}
            onUpgradeStart={() => _log("Upgrading token")}
            onUpgradeEnd={({ signature }) =>
              setNotification({
                message: "Token upgraded",
                link:
                  EXPLORER_URL +
                  `/tx/${signature}?cluster=${getCluster(connection.rpcEndpoint)}`,
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
    </>
  )
}
