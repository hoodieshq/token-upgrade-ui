import { Fragment } from "react"
import { Transition } from "@headlessui/react"

export default function Toast({
  onInspect,
  show = true,
  text = "",
}: {
  onInspect: () => void
  show?: boolean
  text: string
}) {
  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="w-0 flex-1 p-4">
          <div className="flex items-center">
            <div className="flex w-0 flex-1 justify-between">
              <p className="w-0 flex-1 text-sm font-medium text-gray-900">
                {text}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={onInspect}
          >
            Inspect
          </button>
        </div>
      </div>
    </Transition>
  )
}
