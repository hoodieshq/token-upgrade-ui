/**
 *  Converting uiAmount to the number of lamports.
 *
 *  It's needed to mult/div the result to remove inaccuracy.
 */
export function fromUiAmount(uiAmount: number, decimals: number) {
  const result = (1e10 * uiAmount * Math.pow(10, decimals)) / 1e10

  return Math.floor(result)
}
