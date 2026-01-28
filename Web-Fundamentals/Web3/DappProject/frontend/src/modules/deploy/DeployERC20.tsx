import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

import { useFactoryDeploy } from '../../hooks/useFactoryDeploy'
import { useLocalContracts } from '../../hooks/useLocalContracts' // Changed from useTokenFactory
import { BatchMintForm } from '../../components/BatchMintForm'
import { BatchTransferForm } from '../../components/BatchTransferForm'

export const DeployERC20 = () => {
    const { isConnected } = useAccount()
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [supply, setSupply] = useState('')
    const [decimals, setDecimals] = useState('18')
    const [selectedContract, setSelectedContract] = useState('')

    // Use local contracts hook
    const { addContract, getContractsByType } = useLocalContracts()
    const userERC20s = getContractsByType('ERC20')

    const {
        deployERC20,
        isPending,
        isConfirming,
        isConfirmed,
        contractAddress,
        txHash,
        error,
    } = useFactoryDeploy()

    // Listen for successful deployment to save to local storage
    useEffect(() => {
        if (isConfirmed && contractAddress && name && symbol) {
            addContract({
                contractAddress,
                name,
                symbol,
                tokenType: 'ERC20',
                timestamp: Date.now()
            })
        }
    }, [isConfirmed, contractAddress, name, symbol]) // Dependencies to trigger save

    const handleDeploy = () => {
        if (!name || !symbol || !supply) return
        setSelectedContract('') // Clear selection on new deployment
        deployERC20(name, symbol, BigInt(supply || 0), Number(decimals))
    }

    if (!isConnected) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Please connect your wallet to deploy contracts</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deploy ERC20 Token</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Token Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. My Token"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Token Symbol
                        </label>
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="e.g. MTK"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Initial Supply (Tokens)
                            </label>
                            <input
                                type="number"
                                value={supply}
                                onChange={(e) => setSupply(e.target.value)}
                                placeholder="e.g. 1000000"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Decimals
                            </label>
                            <input
                                type="number"
                                value={decimals}
                                onChange={(e) => setDecimals(e.target.value)}
                                placeholder="18"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleDeploy}
                        disabled={isPending || isConfirming || !name || !symbol || !supply}
                        className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all transform active:scale-[0.99]
              ${isPending || isConfirming
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                            }`}
                    >
                        {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Deploying...' : 'Deploy Token'}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                            <p className="font-medium">Error deploying contract:</p>
                            <p>{error?.message}</p>
                        </div>
                    )}

                    {isConfirmed && contractAddress && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                            <p className="font-medium">Contract Deployed Successfully!</p>
                            <p className="mt-1 break-all">Address: {contractAddress}</p>
                            <p className="mt-1 break-all text-xs text-green-600">Tx: {txHash}</p>
                        </div>
                    )}

                    <div className="h-px bg-gray-100 my-6"></div>

                    {/* Contract Selector Section */}
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">Manage Your ERC20 Contracts</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Deployed Contract
                            </label>
                            <select
                                value={selectedContract || (isConfirmed ? contractAddress : '')}
                                onChange={(e) => setSelectedContract(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                            >
                                <option value="">-- Choose a contract --</option>
                                {userERC20s.map((deployment) => (
                                    <option key={deployment.contractAddress} value={deployment.contractAddress}>
                                        {deployment.name} ({deployment.symbol}) - {deployment.contractAddress.slice(0, 6)}...{deployment.contractAddress.slice(-4)}
                                    </option>
                                ))}
                                {isConfirmed && contractAddress && !userERC20s.find(c => c.contractAddress === contractAddress) && (
                                    <option value={contractAddress}>
                                        {name} ({symbol}) - {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)} (Just Deployed)
                                    </option>
                                )}
                            </select>
                        </div>

                        {(selectedContract || (isConfirmed && contractAddress)) && (
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-indigo-900">
                                        Active Contract: {(selectedContract || contractAddress).slice(0, 10)}...{(selectedContract || contractAddress).slice(-8)}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const addr = (selectedContract || contractAddress);
                                            navigator.clipboard.writeText(addr);
                                        }}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Copy Address
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                                            Batch Minting
                                        </h5>
                                        <BatchMintForm
                                            contractAddress={selectedContract || contractAddress}
                                            tokenType="ERC20"
                                        />
                                    </div>

                                    <div className="h-px bg-indigo-100"></div>

                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                                            Batch Transfer
                                        </h5>
                                        <BatchTransferForm
                                            contractAddress={selectedContract || contractAddress}
                                            tokenType="ERC20"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
