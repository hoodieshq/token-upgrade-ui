export function shortenAddress(
  address: string,
  symbol?: string,
  length = 3,
): string {
  let s = symbol
  if (!s && address?.length > length) {
    s = address.slice(0, length) + ".." + address.slice(-1 * length)
  } else if (!s && address?.length <= length) {
    s = address
  } else {
    s = address.slice(0, length - 1) + ".."
  }
  return s
}
