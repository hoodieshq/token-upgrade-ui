import React, { useEffect, useState } from "react"
import { TokenExtensions } from "./token-extensions"
import {
  useTokenExtension,
  TokenExtensionList,
} from "../../entities/token/use-token-extension"
import { Warning } from "../../shared/warning"

interface TokenInfoProps extends React.ComponentPropsWithoutRef<"div"> {
  address?: string
}

export function TokenInfo({ address }: TokenInfoProps) {
  const { extensions, error, isLoading } = useTokenExtension(address)
  const [err, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!isLoading) setError(error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return <TokenInfoBase address={address} error={err} extensions={extensions} />
}

interface TokenInfoBaseProps extends TokenInfoProps {
  address?: string
  error: Error | null
  extensions: TokenExtensionList
}

export function TokenInfoBase({
  address,
  error,
  extensions,
}: TokenInfoBaseProps) {
  return error ? (
    <Warning message="Can not load token extensions" />
  ) : extensions && address ? (
    <>
      <div className="py-2">
        <TokenExtensions address={address} extensions={extensions} />
      </div>
      <Warning message="There is no way to get your original token back after upgrade." />
    </>
  ) : null
}
