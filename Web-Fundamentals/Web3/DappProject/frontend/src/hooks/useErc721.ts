import { isAddress, type Address, type Hash } from 'viem'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const erc721Abi = [
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
  {
    type: 'function',
    name: 'safeTransferFrom',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

export type UseErc721Params = {
  token: Address | ''
  tokenId: string
  to: Address | ''
}

export function useErc721({ token, tokenId, to }: UseErc721Params) {
  const { address } = useAccount()
  const write = useWriteContract()

  const isTokenValid = Boolean(token) && isAddress(token as string)
  const isTokenIdValid = Boolean(tokenId) && /^[0-9]+$/.test(tokenId)
  const isToValid = Boolean(to) && isAddress(to as string)

  const owner = useReadContract({
    abi: erc721Abi,
    address: (token || undefined) as Address | undefined,
    functionName: 'ownerOf',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: isTokenValid && isTokenIdValid },
  })

  const send721 = async () => {
    if (!address || !isTokenValid || !isTokenIdValid || !isToValid) return
    await write.writeContract({
      abi: erc721Abi,
      address: token as Address,
      functionName: 'safeTransferFrom',
      args: [address, to as Address, BigInt(tokenId)],
    })
  }

  const txHash = write.data as Hash | undefined
  const wait = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  })

  return {
    owner,
    send721,
    isPending: write.isPending,
    data: write.data,
    error: write.error,
    txHash,
    isConfirming: wait.isLoading,
    isConfirmed: wait.isSuccess,
    receipt: wait.data,
    waitError: wait.error,
    isTokenValid,
    isTokenIdValid,
    isToValid,
    isDisabled: !isTokenValid || !isTokenIdValid || !isToValid || write.isPending,
  }
}