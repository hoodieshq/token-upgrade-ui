import React, { Fragment, useMemo } from "react"
import { Badge, variants, AccentVariant } from "./badge"
import { getVariantByIndex, shortenAddress } from "./utils"
import { TokenExtensionList } from "../../entities/token/use-token-extension"
import * as Popover from "@radix-ui/react-popover"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid"

interface TokenExtensionProps extends React.ComponentPropsWithoutRef<"div"> {
  address: string
  clusterMoniker: string
  explorerUrl: string
  extensions: TokenExtensionList
}

export function TokenExtensions({
  address,
  clusterMoniker,
  explorerUrl,
  extensions,
}: TokenExtensionProps) {
  const displayAddress = useMemo(
    () => shortenAddress(address, undefined, 12),
    [address],
  )

  return (
    <div>
      <h3 className="truncate text-ellipsis text-base font-semibold leading-6 text-gray-900">
        You will receive the following token:
      </h3>
      <dl className="mt-2.5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg border border-b bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-base font-normal text-gray-900">
            <a
              className="inline-flex items-center gap-x-1.5 font-mono text-violet11 hover:text-violet7"
              href={
                explorerUrl +
                "/address/" +
                address +
                "?cluster=" +
                clusterMoniker
              }
              target="_blank"
            >
              <span>{displayAddress}</span>
              <ArrowTopRightOnSquareIcon className="inline-block h-4 w-4" />
            </a>
          </dt>
          {(extensions?.length ?? 0) > 0 ? (
            <dd
              aria-description="List of extensions enabled for the token"
              className="mt-1"
            >
              <div
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5"
                role="menubar"
              >
                {extensions?.map(({ extension, state }, i) => {
                  return (
                    <Fragment key={extension}>
                      <Popover.Root>
                        <Popover.Trigger asChild>
                          <Badge
                            aria-label="Token Extension"
                            accent={
                              getVariantByIndex(
                                variants.accent,
                                i,
                              ) as AccentVariant
                            }
                            className="cursor-pointer"
                          >
                            {extension}
                          </Badge>
                        </Popover.Trigger>
                        <Popover.Content
                          className="w-[260px] rounded bg-white p-2 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
                          sideOffset={5}
                        >
                          <div className="overflow-x-auto text-xs lg:text-sm">
                            <pre>{JSON.stringify(state, null, 1)}</pre>
                          </div>
                        </Popover.Content>
                      </Popover.Root>
                    </Fragment>
                  )
                })}
              </div>
            </dd>
          ) : (
            <dd
              aria-description="No enabled extensions for the token"
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
