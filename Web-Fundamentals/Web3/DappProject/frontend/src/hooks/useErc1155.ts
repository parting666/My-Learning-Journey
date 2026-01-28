import { isAddress, type Address, type Hash } from 'viem'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const erc1155Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'safeTransferFrom',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'value', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [],
  },
] as const

export type UseErc1155Params = {
  token: Address | ''
  tokenId: string
  amount: string
  to: Address | ''
}

export function useErc1155({ token, tokenId, amount, to }: UseErc1155Params) {
  const { address } = useAccount()
  const write = useWriteContract()

  const isTokenValid = Boolean(token) && isAddress(token as string)
  const isTokenIdValid = Boolean(tokenId) && /^[0-9]+$/.test(tokenId)
  const isAmountValid = Boolean(amount) && /^[0-9]+$/.test(amount)
  const isToValid = Boolean(to) && isAddress(to as string)

  const balance = useReadContract({
    abi: erc1155Abi,
    address: (token || undefined) as Address | undefined,
    functionName: 'balanceOf',
    args: address && tokenId ? [address, BigInt(tokenId)] : undefined,
    query: { enabled: Boolean(address) && isTokenValid && isTokenIdValid },
  })

  const send1155 = async () => {
    if (!address || !isTokenValid || !isTokenIdValid || !isAmountValid || !isToValid) return
    await write.writeContract({
      abi: erc1155Abi,
      address: token as Address,
      functionName: 'safeTransferFrom',
      args: [address, to as Address, BigInt(tokenId), BigInt(amount), '0x'],
    })
  }

  const txHash = write.data as Hash | undefined
  const wait = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  })

  return {
    balance,
    send1155,
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
    isAmountValid,
    isToValid,
    isDisabled: !isTokenValid || !isTokenIdValid || !isAmountValid || !isToValid || write.isPending,
  }
}