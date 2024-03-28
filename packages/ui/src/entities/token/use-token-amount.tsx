import { useReducer } from "react"

export type State = {
  amount?: number
  destination?: string
}

function useTokenAmount<S extends State>(state: S, action: any): State {
  if (!action) return state

  switch (action.type) {
    case "changeAmount": {
      let nextState = state

      const { amount: nextAmount } = action.payload
      if (nextAmount === state?.amount) {
        nextState = state
      } else {
        nextState = { ...state, amount: nextAmount }
      }

      return nextState
    }
    case "changeDestination": {
      return { ...state, destination: action.payload.destination }
    }
    case "clear": {
      return {}
    }
    default:
      return state
  }
}

export default function useTokenAmountReducer(defaultState: State = {}) {
  return useReducer(useTokenAmount, defaultState)
}
