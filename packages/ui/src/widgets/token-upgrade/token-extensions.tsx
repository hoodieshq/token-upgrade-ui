import React, { useMemo } from "react"
import { Badge } from "./badge"
import { TokenExtensionList } from "../../entities/token/use-token-extension"
import { shortenAddress } from "./utils"

interface TokenExtensionProps extends React.ComponentPropsWithoutRef<"div"> {
  address: string
  extensions: TokenExtensionList
}

export function TokenExtensions({ address, extensions }: TokenExtensionProps) {
  const displayAddress = useMemo(() => shortenAddress(address), [address])

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Token has these extensions enabled
      </h3>
      <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg border border-b bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-base font-normal text-gray-900">
            {displayAddress} extensions
          </dt>
          {extensions?.length ?? 0 > 0 ? (
            <dd
              aria-description="List of extensions enabled for the token"
              aria-label="Enabled Extensions"
              className="mt-1 flex items-baseline justify-between md:block lg:flex"
            >
              {extensions?.map(({ extension }) => (
                <Badge key={extension}>{extension}</Badge>
              ))}
            </dd>
          ) : (
            <dd
              aria-description="No enabled extensions for the token"
              aria-label="No Extensions"
              className="mt-1 flex items-baseline justify-between md:block lg:flex"
            >
              There are no token extensions enabled.
            </dd>
          )}
        </div>
      </dl>
    </div>
  )
}
