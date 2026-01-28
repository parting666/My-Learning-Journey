import { useState } from 'react'
import { parseUnits } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { MyERC20Token } from '../artifacts'
import { MyERC721NFT } from '../artifacts'
import { MyERC1155Token } from '../artifacts'

type TokenType = 'ERC20' | 'ERC721' | 'ERC1155'

interface BatchMintFormProps {
    contractAddress: string
    tokenType: TokenType
}

export const BatchMintForm = ({ contractAddress, tokenType }: BatchMintFormProps) => {
    // ERC20 & ERC721
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')

    // ERC1155 specific
    const [tokenIds, setTokenIds] = useState('')
    const [amounts, setAmounts] = useState('')
    const [data, setData] = useState('0x')

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

    const handleMint = () => {
        if (!contractAddress) return

        try {
            if (tokenType === 'ERC20') {
                // Parse amount based on decimals
                const parsedAmount = parseUnits(amount, Number(decimals || 18))

                writeContract({
                    address: contractAddress as `0x${string}`,
                    abi: MyERC20Token.abi,
                    functionName: 'mint',
                    args: [recipient, parsedAmount],
                })
            } else if (tokenType === 'ERC721') {
                // ERC721: batchMint(to, amount)
                // MyERC721NFT.sol: function batchMint(address to, uint256 amount) public onlyOwner
                writeContract({
                    address: contractAddress as `0x${string}`,
                    abi: MyERC721NFT.abi,
                    functionName: 'batchMint',
                    args: [recipient, BigInt(amount)],
                })
            } else if (tokenType === 'ERC1155') {
                // ERC1155: mintBatch(to, ids, amounts, data)
                // MyERC1155Token.sol: function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner
                const idsArray = tokenIds.split(',').map(s => BigInt(s.trim()))
                const amountsArray = amounts.split(',').map(s => BigInt(s.trim()))

                writeContract({
                    address: contractAddress as `0x${string}`,
                    abi: MyERC1155Token.abi,
                    functionName: 'mintBatch',
                    args: [recipient, idsArray, amountsArray, data as `0x${string}`],
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const isFormValid = () => {
        if (tokenType === 'ERC1155') {
            return recipient && tokenIds && amounts
        }
        return recipient && amount
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {tokenType === 'ERC20' ? 'Mint Tokens' : 'Batch Mint'}
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Address
                    </label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                {tokenType !== 'ERC1155' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {tokenType === 'ERC721' ? 'Quantity' : 'Amount (Tokens)'}
                        </label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={tokenType === 'ERC721' ? "e.g. 5" : "e.g. 1000"}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                )}

                {tokenType === 'ERC1155' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Token IDs (comma separated)
                            </label>
                            <input
                                type="text"
                                value={tokenIds}
                                onChange={(e) => setTokenIds(e.target.value)}
                                placeholder="e.g. 1, 2, 3"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amounts (comma separated, matching IDs)
                            </label>
                            <input
                                type="text"
                                value={amounts}
                                onChange={(e) => setAmounts(e.target.value)}
                                placeholder="e.g. 10, 20, 30"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </>
                )}

                <button
                    onClick={handleMint}
                    disabled={isPending || isConfirming || !isFormValid()}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all transform active:scale-[0.99]
                        ${isPending || isConfirming || !isFormValid()
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                        }`}
                >
                    {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint'}
                </button>

                {(writeError) && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        <p className="font-medium">Error:</p>
                        <p>{writeError.message}</p>
                    </div>
                )}

                {isConfirmed && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                        <p className="font-medium">Mint Successful!</p>
                        <p className="mt-1 break-all text-xs text-green-600">Tx: {txHash}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
