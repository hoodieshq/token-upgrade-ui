import React, { useEffect, useState } from "react"
import { TokenExtensions } from "./token-extensions"
import {
  useTokenExtension,
  TokenExtensionList,
} from "../../entities/token/use-token-extension"
import { Warning } from "../../shared/warning"

interface TokenInfoProps extends React.ComponentPropsWithoutRef<"div"> {
  address?: string
  clusterMoniker: string
  explorerUrl: string
}

export function TokenInfo({ address, ...props }: TokenInfoProps) {
  const { extensions, error, isLoading } = useTokenExtension(address)
  const [err, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!isLoading) setError(error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <TokenInfoBase
      address={address}
      error={err}
      extensions={extensions}
      {...props}
    />
  )
}

interface TokenInfoBaseProps extends TokenInfoProps {
  address?: string
  clusterMoniker: string
  error: Error | null
  explorerUrl: string
  extensions: TokenExtensionList
}

export function TokenInfoBase({
  address,
  clusterMoniker,
  error,
  explorerUrl,
  extensions,
}: TokenInfoBaseProps) {
  return error ? (
    <Warning message="Can not load token extensions" />
  ) : extensions && address ? (
    <>
      <div className="py-2">
        <TokenExtensions
          address={address}
          clusterMoniker={clusterMoniker}
          explorerUrl={explorerUrl}
          extensions={extensions}
        />
      </div>
      <Warning message="There is no way to get your original token back after upgrade." />
    </>
  ) : null
}
