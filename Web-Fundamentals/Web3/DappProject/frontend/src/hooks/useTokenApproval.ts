import { Address, erc20Abi, isAddress, parseUnits, type Hash } from 'viem'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { isPositiveNumberString } from '../utils/format'

export type UseTokenApprovalParams = {
  token: Address | ''
  spender: Address | ''
  amount: string
}

export function useTokenApproval({ token, spender, amount }: UseTokenApprovalParams) {
  const write = useWriteContract()

  const decimals = useReadContract({
    abi: erc20Abi,
    address: token || undefined,
    functionName: 'decimals',
    query: { enabled: Boolean(token) },
  })

  const isTokenValid = Boolean(token) && isAddress(token as string)
  const isSpenderValid = Boolean(spender) && isAddress(spender as string)
  const isAmountValid = isPositiveNumberString(amount)

  const approve = async () => {
    if (!isTokenValid || !isSpenderValid || !isAmountValid) return
    const d = (decimals.data as number | undefined) ?? 18
    await write.writeContract({
      abi: erc20Abi,
      address: token as Address,
      functionName: 'approve',
      args: [spender as Address, parseUnits(amount, d)],
    })
  }

  const txHash = write.data as Hash | undefined
  const wait = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  })

  return {
    approve,
    decimals,
    isPending: write.isPending,
    data: write.data,
    error: write.error,
    txHash,
    isConfirming: wait.isLoading,
    isConfirmed: wait.isSuccess,
    receipt: wait.data,
    waitError: wait.error,
    isTokenValid,
    isSpenderValid,
    isAmountValid,
    isDisabled: !isTokenValid || !isSpenderValid || !isAmountValid || write.isPending,
  }
}