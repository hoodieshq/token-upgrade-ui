import "../styles/tailwind.css"
import React from "react"
import { UpgradeButton } from "../features/upgrade-button"
import { TextField } from "../shared/fields"

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
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:p-6">
        <Container>
          <div>
            <TextField label="amount"></TextField>

</div>
          <div>Optional Destination</div>
          <UpgradeButton />
        </Container>
      </div>
    </div>
  )
}
