import { useState } from 'react'
import { parseUnits } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { MyERC20Token } from '../artifacts'
import { MyERC721NFT } from '../artifacts'
import { MyERC1155Token } from '../artifacts'

type TokenType = 'ERC20' | 'ERC721' | 'ERC1155'

interface BatchTransferFormProps {
    contractAddress: string
    tokenType: TokenType
}

export const BatchTransferForm = ({ contractAddress, tokenType }: BatchTransferFormProps) => {
    const [inputText, setInputText] = useState('')

    const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    })

    // Read decimals for ERC20
    const { data: decimals } = useReadContract({
        address: tokenType === 'ERC20' ? contractAddress as `0x${string}` : undefined,
        abi: MyERC20Token.abi,
        functionName: 'decimals',
        query: {
            enabled: tokenType === 'ERC20' && !!contractAddress,
        }
    })

    const handleTransfer = () => {
        if (!contractAddress || !inputText) return

        try {
            const lines = inputText.trim().split('\n').filter(line => line.trim() !== '')

            if (tokenType === 'ERC20') {
                // Format: Address, Amount
                const recipients: string[] = []
                const amounts: bigint[] = []

                lines.forEach(line => {
                    const [addr, amt] = line.split(',').map(s => s.trim())
                    if (addr && amt) {
                        recipients.push(addr)
                        // Parse amount based on decimals
                        amounts.push(parseUnits(amt, Number(decimals || 18)))
                    }
                })

                writeContract({
                    address: contractAddress as `0x${string}`,
                    abi: MyERC20Token.abi,
                    functionName: 'batchTransfer',
                    args: [recipients, amounts],
                })
            } else if (tokenType === 'ERC721') {
                // Format: Address, TokenID
                // Wait, MyERC721NFT `batchTransferMultiple` takes arrays of recipients and tokenIds.
                const recipients: string[] = []
                const tokenIds: bigint[] = []

                lines.forEach(line => {
                    const [addr, id] = line.split(',').map(s => s.trim())
                    if (addr && id) {
                        recipients.push(addr)
                        tokenIds.push(BigInt(id))
                    }
                })

                writeContract({
                    address: contractAddress as `0x${string}`,
                    abi: MyERC721NFT.abi,
                    functionName: 'batchTransferMultiple',
                    args: [recipients, tokenIds],
                })
            } else if (tokenType === 'ERC1155') {
                // Format: Address, TokenID, Amount
                const recipients: string[] = []
                const ids: bigint[] = []
                const amounts: bigint[] = []

                lines.forEach(line => {
                    const [addr, id, amt] = line.split(',').map(s => s.trim())
                    if (addr && id && amt) {
                        recipients.push(addr)
                        ids.push(BigInt(id))
                        amounts.push(BigInt(amt))
                    }
                })

                writeContract({
                    address: contractAddress as `0x${string}`,
                    abi: MyERC1155Token.abi,
                    functionName: 'batchTransferMultiple', // The new function we added
                    args: [recipients, ids, amounts],
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getPlaceholder = () => {
        switch (tokenType) {
            case 'ERC20':
                return "0x123..., 10\n0x456..., 20"
            case 'ERC721':
                return "0x123..., 1\n0x456..., 2"
            case 'ERC1155':
                return "0x123..., 1, 10\n0x456..., 2, 20"
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Transfer</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipients & Data (One per line)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Format: {tokenType === 'ERC20' ? 'Address, Amount (Tokens)' : tokenType === 'ERC721' ? 'Address, TokenID' : 'Address, TokenID, Amount'}
                    </p>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={getPlaceholder()}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                    />
                </div>

                <button
                    onClick={handleTransfer}
                    disabled={isPending || isConfirming || !inputText}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all transform active:scale-[0.99]
                        ${isPending || isConfirming || !inputText
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                        }`}
                >
                    {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Batch Transfer'}
                </button>

                {(writeError) && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        <p className="font-medium">Error:</p>
                        <p>{writeError.message}</p>
                    </div>
                )}

                {isConfirmed && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                        <p className="font-medium">Batch Transfer Successful!</p>
                        <p className="mt-1 break-all text-xs text-green-600">Tx: {txHash}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
