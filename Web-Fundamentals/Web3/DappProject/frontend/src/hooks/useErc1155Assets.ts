import { isAddress, type Address } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'

const erc1155Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ name: 'value', type: 'uint256' }],
  },
] as const

export function useErc1155Assets(
  contract?: Address,
  ids?: readonly bigint[]
): {
  enabled: boolean
  balances: Array<{ id: bigint; balance: bigint }> | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => Promise<void>
} {
  const { address } = useAccount()
  const enabled = !!address && !!contract && isAddress(contract)
  const list = enabled && ids && ids.length > 0 ? ids : []

  const contracts = list.map((id) => ({
    abi: erc1155Abi,
    address: contract!,
    functionName: 'balanceOf' as const,
    args: [address!, id],
  }))

  const query = useReadContracts({
    contracts,
    query: { enabled: enabled && contracts.length > 0 },
  })

  const balances: Array<{ id: bigint; balance: bigint }> | undefined =
    contracts.length > 0
      ? query.data?.map((r, i) => ({
          id: list[i],
          balance: r.status === 'success' ? (r.result as bigint) : 0n,
        }))
      : undefined

  return {
    enabled,
    balances,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as unknown,
    refetch: async () => {
      await query.refetch()
    },
  }
}
