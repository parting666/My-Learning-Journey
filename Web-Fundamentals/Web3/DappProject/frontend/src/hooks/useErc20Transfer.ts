import { Address, erc20Abi, isAddress, parseUnits, type Hash } from 'viem'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { isPositiveNumberString } from '../utils/format'

export type UseErc20TransferParams = {
  token: Address | ''
  to: Address | ''
  amount: string
}

export function useErc20Transfer({ token, to, amount }: UseErc20TransferParams) {
  const write = useWriteContract()

  const decimals = useReadContract({
    abi: erc20Abi,
    address: token || undefined,
    functionName: 'decimals',
    query: { enabled: Boolean(token) },
  })

  const isTokenValid = Boolean(token) && isAddress(token as string)
  const isToValid = Boolean(to) && isAddress(to as string)
  const isAmountValid = isPositiveNumberString(amount)

  const sendErc20 = async () => {
    if (!isTokenValid || !isToValid || !isAmountValid) return
    const d = (decimals.data as number | undefined) ?? 18
    await write.writeContract({
      abi: erc20Abi,
      address: token as Address,
      functionName: 'transfer',
      args: [to as Address, parseUnits(amount, d)],
    })
  }

  const txHash = write.data as Hash | undefined
  const wait = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  })

  return {
    sendErc20,
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
    isToValid,
    isAmountValid,
    isDisabled: !isTokenValid || !isToValid || !isAmountValid || write.isPending,
  }
}