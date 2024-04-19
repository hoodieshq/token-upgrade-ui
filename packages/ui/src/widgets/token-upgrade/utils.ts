export function getVariantByIndex(variants: string[], variant: number) {
  const len = variants.length
  const base = Math.floor(variant / len)
  return variants[variant - base * len]
}

export function shortenAddress(
  address: string,
  symbol?: string,
  length = 3,
): string {
  let s
  if (!symbol && address.length > length) {
    s = address.slice(0, length) + ".." + address.slice(-1 * length)
  } else if (!symbol && address.length <= length) {
    s = address
  } else {
    s = symbol || address.slice(0, length - 1) + ".."
  }
  return s
}
