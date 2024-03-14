import { Pattern } from "../shared/pattern"
import { TokenUpgrade } from "@solana/token-upgrade-ui"

export default function Home() {
  return (
    <>
      <Pattern />
      <div className="prose p-2 dark:prose-invert">
        <div className="container flex justify-center">
          <TokenUpgrade />
        </div>
      </div>
    </>
  )
}
