import "../styles/tailwind.css"
import React from "react"
import { UpgradeButton } from "../features/upgrade-button"
import { TextField } from "../shared/fields"
import Amount from "./token-upgrade/amount"
import * as Form from "@radix-ui/react-form"
import Destination from "./token-upgrade/destination"

import clsx from "clsx"

function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}

export function TokenUpgrade() {
  return (
    <Form.Root className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:p-6">
        <Container>
          <div>
            <TextField label="amount"></TextField>
          </div>
          <Form.Field name="amount">
            <Amount />
          </Form.Field>

          <Form.Field name="destination">
            <Destination />
          </Form.Field>
          <div>Optional Destination</div>
          <UpgradeButton />
        </Container>
      </div>
    </Form.Root>
  )
}
