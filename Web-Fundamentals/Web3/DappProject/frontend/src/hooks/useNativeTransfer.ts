import { Address, isAddress, parseUnits, type Hash } from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { isPositiveNumberString } from '../utils/format'

export type UseNativeTransferParams = {
  to: Address | ''
  amount: string
}

export function useNativeTransfer({ to, amount }: UseNativeTransferParams) {
  const sendTx = useSendTransaction()

  const isToValid = Boolean(to) && isAddress(to as string)
  const isAmountValid = isPositiveNumberString(amount)

  const sendNative = async () => {
    if (!isToValid || !isAmountValid) return
    await sendTx.sendTransaction({
      to: to as Address,
      value: parseUnits(amount, 18),
    })
  }

  const txHash = sendTx.data as Hash | undefined
  const wait = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  })

  return {
    sendNative,
    isPending: sendTx.isPending,
    data: sendTx.data,
    error: sendTx.error,
    txHash,
    isConfirming: wait.isLoading,
    isConfirmed: wait.isSuccess,
    receipt: wait.data,
    waitError: wait.error,
    isToValid,
    isAmountValid,
    isDisabled: !isToValid || !isAmountValid || sendTx.isPending,
  }
}