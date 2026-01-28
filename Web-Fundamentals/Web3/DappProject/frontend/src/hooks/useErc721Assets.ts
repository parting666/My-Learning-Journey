import { isAddress, type Address } from 'viem'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'

const erc721EnumerableAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    // ERC-721 Enumerable extension
    type: 'function',
    name: 'tokenOfOwnerByIndex',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
] as const

export function useErc721Assets(
  contract?: Address
): {
  enabled: boolean
  balance: bigint | undefined
  tokenIds: bigint[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => Promise<void>
} {
  const { address } = useAccount()
  const enabled = !!address && !!contract && isAddress(contract)

  const balanceQuery = useReadContract({
    abi: erc721EnumerableAbi,
    address: enabled ? contract : undefined,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled },
  })

  const balance = (balanceQuery.data as bigint | undefined) ?? undefined

  const maxEnumerate = 100n
  const shouldEnumerate = enabled && balance !== undefined && balance > 0n && balance <= maxEnumerate

  const contracts = shouldEnumerate
    ? Array.from({ length: Number(balance) }, (_, i) => ({
        abi: erc721EnumerableAbi,
        address: contract!,
        functionName: 'tokenOfOwnerByIndex' as const,
        args: [address!, BigInt(i)],
      }))
    : []

  const enumerateQuery = useReadContracts({
    contracts,
    query: { enabled: shouldEnumerate },
  })

  const tokenIds: bigint[] | undefined = shouldEnumerate
    ? enumerateQuery.data?.map((r) => (r.status === 'success' ? (r.result as bigint) : undefined)).filter((v): v is bigint => v !== undefined)
    : undefined

  return {
    enabled,
    balance,
    tokenIds,
    isLoading: balanceQuery.isLoading || enumerateQuery.isLoading,
    isError: balanceQuery.isError || enumerateQuery.isError,
    error: (balanceQuery.error ?? enumerateQuery.error) as unknown,
    refetch: async () => {
      await balanceQuery.refetch()
      await enumerateQuery.refetch()
    },
  }
}
