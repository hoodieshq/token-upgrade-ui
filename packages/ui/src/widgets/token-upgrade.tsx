import "../styles/tailwind.css"
import React from "react"
import { UpgradeButton } from "../features/upgrade-button"
export function TokenUpgrade() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:p-6">
        <div>Amount</div>
        <div>Optional Destination</div>
        <UpgradeButton />
      </div>
    </div>
  )
}
