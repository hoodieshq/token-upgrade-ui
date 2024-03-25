import { useReducer } from "react"

export type State = {
  amount?: number
  destination?: string
}

function useTokenAmount<S extends State>(state: S, action: any): State {
  if (!action) return state

  switch (action.type) {
    case "changeAmount": {
      return { ...state, amount: action.payload.amount }
    }
    default:
      return state
  }
}

export default function useTokenAmountReducer(defaultState: State = {}) {
  return useReducer(useTokenAmount, defaultState)
}
