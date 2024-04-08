import React from "react"
import * as Form from "@radix-ui/react-form"

interface DestinationInputProps
  extends React.ComponentPropsWithoutRef<"input"> {
  label?: string
  onFieldChange?: (a: { value: string | undefined }) => void
}

export default function DestinationInput({
  className,
  label = "Destination",
  name = "destination",
  onFieldChange,
  placeholder = "Enter base-58 wallet address",
  ...props
}: DestinationInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        id={`${name}-label`}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <Form.Control
          asChild
          type="text"
          onChange={(e) => {
            const { value } = e.target
            const isValid = value?.length > 0
            if (isValid) onFieldChange?.({ value })
            else onFieldChange?.({ value: undefined })
          }}
        >
          <input
            aria-describedby={`${name}-label`}
            className="block w-full rounded-md border-0 border-violet1 py-1.5 pl-7 pr-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            id={name}
            name={name}
            placeholder={placeholder}
            type="text"
            role="textbox"
            {...props}
          />
        </Form.Control>
      </div>
    </div>
  )
}
