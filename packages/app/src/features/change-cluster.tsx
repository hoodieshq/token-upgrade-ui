import { useNotificationContext } from "@solana/token-upgrade-ui"
import React from "react"

type ClusterContextType = {
  readonly endpoint: string
  readonly setEndpoint: (endpoint: string) => void
}

export const ClusterContext = React.createContext<
  ClusterContextType | undefined
>(undefined)

export function useClusterContext() {
  const context = React.useContext(ClusterContext)
  if (context === undefined) throw new Error("Cluster context required")
  return context
}

interface ChangeClusterProps extends React.ComponentPropsWithoutRef<"input"> {
  onChangeEndpoint?: (endpoint: string) => void
}

export default function ChangeCluster({
  className,
  name = "endpoint",
  onChange,
  onChangeEndpoint,
}: ChangeClusterProps) {
  const { setNotification } = useNotificationContext()
  const { endpoint, setEndpoint } = useClusterContext()
  const [raw, setRaw] = React.useState(endpoint)

  const trySetEndpoint = React.useCallback(
    (value: string) => {
      try {
        const url = new URL(value)
        onChangeEndpoint?.(url.href)
        setEndpoint(url.href)
        setNotification({ message: `Change cluster to: ${url.href}` })
      } catch (e: unknown) {
        console.error(e)
      }
    },
    [onChangeEndpoint, setEndpoint, setNotification],
  )

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
      >
        Cluster endpoint <i className="text-xs">(see console for logs)</i>
      </label>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <input
            type="text"
            name={name}
            id={name}
            className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={endpoint}
            onChange={(e) => {
              onChange?.(e)
              setRaw(e.target.value)
            }}
          />
        </div>
        <button
          type="button"
          className="dark:bg-gray relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => trySetEndpoint(raw)}
        >
          Use
        </button>
      </div>
    </div>
  )
}
