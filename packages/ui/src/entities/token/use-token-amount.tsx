import { useReducer } from "react"

export type State = {}

function useTokenAmount<S extends State>(state: S, action: any): State {
  if (!action) return state

  console.log({ action })

  return {}
}

export default function useTokenAmountReducer(defaultState: State = {}) {
  return useReducer(useTokenAmount, defaultState)
}
