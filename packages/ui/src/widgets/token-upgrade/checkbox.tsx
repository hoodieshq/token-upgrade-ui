import React, { forwardRef } from "react"
import * as Checkbox from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import { twMerge } from "tailwind-merge"

interface CheckProps extends React.ComponentProps<typeof Checkbox.Root> {
  defaultChecked?: Checkbox.CheckedState
  label?: string
  onCheckedChange?: (checked: Checkbox.CheckedState) => void
}

export default forwardRef<HTMLDivElement, CheckProps>(function Check(
  {
    className,
    defaultChecked,
    id = "c1",
    label = "Send to another address",
    onCheckedChange,
    ...props
  },
  forwardRef,
) {
  return (
    <div className={twMerge(className, "flex items-center")} ref={forwardRef}>
      <div className="min-w-0 flex-1 text-sm leading-6">
        <label htmlFor={id} className="font-medium text-gray-900">
          {label}
        </label>
      </div>
      <div className="ml-3 flex h-6 items-center">
        <Checkbox.Root
          className="flex h-[20px] w-[20px] appearance-none items-center justify-center rounded bg-white shadow-[0_1px_4px] shadow-blackA4 outline-none focus:shadow-[0_0_0_1px_black] hover:enabled:bg-violet3 dark:border"
          defaultChecked={defaultChecked}
          id={id}
          onCheckedChange={onCheckedChange}
          {...props}
        >
          <Checkbox.Indicator className="text-violet11">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    </div>
  )
})
