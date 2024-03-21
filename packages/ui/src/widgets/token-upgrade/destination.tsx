import * as Form from "@radix-ui/react-form"
import Check from "./checkbox"
import DestinationInput from "./destination-input"
import React, { useCallback, useState } from "react"

interface DestinationProps extends React.ComponentPropsWithoutRef<"input"> {}

export default function Destination(props: DestinationProps) {
  const [customDestination, setDestination] = useState<boolean>(false)

  const onChange = useCallback((checked: boolean) => {
    setDestination(checked)
  }, [])

  return (
    <>
      <div className="relative flex items-start pb-4 pt-3.5">
        <div className="min-w-0 flex-1 text-sm leading-6"></div>
        <div className="ml-3 flex h-6 items-center">
          <Form.Control name="destinationFlag" asChild>
            <Check onCheckedChange={onChange} />
            {/*<input
                  id="destination"
                  aria-describedby="offers-description"
                  name="destination"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />*/}
          </Form.Control>
        </div>
      </div>
      {!customDestination ? null : <DestinationInput />}
    </>
  )
}
