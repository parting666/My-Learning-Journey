import { Address, erc20Abi, formatUnits, isAddress } from 'viem'
import { useAccount, useBalance, useReadContract, useChainId } from 'wagmi'

export function useNativeBalance() {
  const { address } = useAccount()
  const chainId = useChainId()
  return useBalance({
    address,
    chainId,
    // 使用 React Query 的轮询刷新以获得更接近实时的余额
    query: { enabled: Boolean(address), refetchInterval: 10_000 },
  })
}

export function useErc20Balance(token?: Address, owner?: Address) {
  const chainId = useChainId()
  const validToken = Boolean(token && isAddress(token))
  const validOwner = Boolean(owner && isAddress(owner))
  const decimals = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'decimals',
    chainId,
    query: { enabled: validToken, staleTime: 24 * 60 * 60 * 1000, retry: false },
  })
  const symbol = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'symbol',
    chainId,
    query: { enabled: validToken, staleTime: 24 * 60 * 60 * 1000, retry: false },
  })
  const balance = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    chainId,
    query: { enabled: validToken && validOwner, refetchInterval: 10_000, retry: false },
  })

  const formatted = (() => {
    const d = decimals.data as number | undefined
    const b = balance.data as bigint | undefined
    if (d != null && b != null) return formatUnits(b, d)
    return undefined
  })()

  return { decimals, symbol, balance, formatted }
}