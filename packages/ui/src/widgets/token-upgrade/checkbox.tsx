import React from "react"
import * as Checkbox from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

export default function Check({
  defaultChecked,
  onCheckedChange,
}: React.ComponentProps<typeof Checkbox.Root>) {
  return (
    <div className="flex items-center">
      <div className="min-w-0 flex-1 text-sm leading-6">
        <label htmlFor="c1" className="font-medium text-gray-900">
          Custom Destination
        </label>
      </div>
      <div className="ml-3 flex h-6 items-center">
        <Checkbox.Root
          className="shadow-blackA4 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
          defaultChecked={defaultChecked}
          id="c1"
          onCheckedChange={onCheckedChange}
        >
          <Checkbox.Indicator className="text-violet11">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    </div>
  )
}
