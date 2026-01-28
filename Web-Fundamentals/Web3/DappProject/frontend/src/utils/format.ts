import type { Address } from 'viem'

export function truncateAddress(addr?: Address | string, size = 4) {
  if (!addr) return ''
  const a = String(addr)
  return a.length > 2 + size * 2 ? `${a.slice(0, 2 + size)}…${a.slice(-size)}` : a
}

export function isPositiveNumberString(val?: string) {
  if (!val) return false
  return /^[0-9]+(\.[0-9]+)?$/.test(val) && Number(val) > 0
}