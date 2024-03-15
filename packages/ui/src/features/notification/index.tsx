import React, { createContext, useContext, useState } from "react"
import * as Toast from "@radix-ui/react-toast"
import ToastBody from "./toast"

export type NotificationContextType = {
  readonly message?: string
  readonly link?: string
  readonly setData: (data: { message: string; link?: string }) => void
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined)

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("Notification context required")
  }

  return context
}

export function NotificationProvider({
  children,
  swipeDirection = "right",
}: Pick<Toast.ToastProviderProps, "swipeDirection"> & {
  children: React.ReactNode
}) {
  const [data, setData] = useState<
    { message: string; link?: string } | undefined
  >(undefined)

  const open = Boolean(data?.message)

  return (
    <NotificationContext.Provider
      value={{ message: data?.message, link: data?.link, setData }}
    >
      <Toast.Provider swipeDirection={swipeDirection}>
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <Toast.Root
              className="grid grid-cols-[auto_max-content] items-center rounded-md bg-white data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
              open={open}
              onOpenChange={() => {
                setData(undefined)
              }}
            >
              {data?.message ? (
                <ToastBody
                  text={data.message}
                  show={open}
                  onInspect={() => {
                    /* TODO: implement link handler */
                  }}
                />
              ) : null}
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
          </div>
        </div>
      </Toast.Provider>
      {children}
    </NotificationContext.Provider>
  )
}
