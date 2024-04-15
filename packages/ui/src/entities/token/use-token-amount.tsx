import { useReducer } from "react"

export type State = {
  uiAmount?: number
}

function useTokenAmount<S extends State>(state: S, action: any): State {
  if (!action) return state

  switch (action.type) {
    case "changeAmount": {
      let nextState = state

      const { uiAmount: nextAmount } = action.payload
      if (nextAmount === state?.uiAmount) {
        nextState = state
      } else {
        nextState = { ...state, uiAmount: nextAmount }
      }

      return nextState
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
