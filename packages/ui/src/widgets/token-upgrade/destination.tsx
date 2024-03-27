import * as Form from "@radix-ui/react-form"
import Check from "./checkbox"
import DestinationInput from "./destination-input"
import React, { useCallback, useState } from "react"
import { CheckedState } from "@radix-ui/react-checkbox"

interface DestinationProps extends React.ComponentPropsWithoutRef<"input"> {
  onDestinationChange: (a: { value: string | undefined }) => void
}

export default function Destination({
  onDestinationChange,
  ...props
}: DestinationProps) {
  const [customDestination, setDestination] = useState<boolean>(false)

  const onChange = useCallback(
    (checked: CheckedState) => {
      const nextChecked = checked === "indeterminate" ? false : checked
      setDestination(nextChecked)
      if (!nextChecked) onDestinationChange({ value: undefined })
    },
    [onDestinationChange],
  )

  return (
    <>
      <div className="flex pb-3 pt-1.5">
        <div className="flex-1"></div>
        <div className="ml-3 flex h-6 items-center">
          <Form.Control name="destinationFlag" asChild>
            <Check
              defaultChecked={customDestination}
              onCheckedChange={onChange}
            />
          </Form.Control>
        </div>
      </div>
      {!customDestination ? null : (
        <DestinationInput onFieldChange={onDestinationChange} {...props} />
      )}
    </>
  )
}
