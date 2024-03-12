import { Pattern } from "../shared/pattern"
import { TokenUpgrade } from "@solana/token-upgrade-ui"

export default function Home() {
  return (
    <>
      <Pattern />
      <p className="not-lead">
        <TokenUpgrade />
      </p>
    </>
  )
}
