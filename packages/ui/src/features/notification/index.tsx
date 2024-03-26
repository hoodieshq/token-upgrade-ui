import React, { createContext, useCallback, useContext, useState } from "react"
import * as Toast from "@radix-ui/react-toast"
import ToastBody from "./toast"

export type NotificationContextType = {
  readonly message?: string
  readonly link?: string
  readonly setNotification: (data: { message: string; link?: string }) => void
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

export interface NotificationProviderProps
  extends React.PropsWithChildren,
    Pick<Toast.ToastProviderProps, "swipeDirection"> {
  onInspect?: (p: { link: string }) => void
}

export function NotificationProvider({
  children,
  onInspect,
  swipeDirection = "right",
}: NotificationProviderProps) {
  const [data, setNotification] = useState<
    { message: string; link?: string } | undefined
  >(undefined)

  const open = Boolean(data?.message)

  const handleInspect = useCallback(() => {
    if (data?.link) onInspect?.({ link: data.link })
  }, [data, onInspect])

  return (
    <NotificationContext.Provider
      value={{ message: data?.message, link: data?.link, setNotification }}
    >
      <Toast.Provider swipeDirection={swipeDirection}>
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <Toast.Root
              className="grid grid-cols-[auto_max-content] items-center rounded-md bg-white data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
              open={open}
              onOpenChange={() => {
                setNotification(undefined)
              }}
            >
              {data?.message ? (
                <ToastBody
                  text={data.message}
                  link={data.link}
                  show={open}
                  onInspect={handleInspect}
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
