import * as web3 from "@solana/web3.js"

export function nativeToUiAmount(balance: number) {
  const amount = balance / web3.LAMPORTS_PER_SOL
  const decimals = Math.round(Math.log(web3.LAMPORTS_PER_SOL) / Math.log(10))

  return {
    uiAmount: amount,
    uiAmountString: amount.toFixed(decimals)
  }
}
