import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useContractDeploy } from '../../hooks/useContractDeploy'
import { DeployERC20 } from './DeployERC20'
import { DeployERC721 } from './DeployERC721'
import { DeployERC1155 } from './DeployERC1155'

function DeployCustom() {
    const { isConnected } = useAccount()
    const [bytecode, setBytecode] = useState('')
    const [constructorArgs, setConstructorArgs] = useState('')
    const [abi, setAbi] = useState('')

    // Parse constructor arguments from JSON string
    let parsedArgs: any[] = []
    let argsError = ''
    try {
        if (constructorArgs.trim()) {
            parsedArgs = JSON.parse(constructorArgs)
            if (!Array.isArray(parsedArgs)) {
                argsError = '构造函数参数必须是数组格式'
            }
        }
    } catch (e) {
        argsError = '构造函数参数 JSON 格式错误'
    }

    // Parse ABI from JSON string
    let parsedAbi: any[] = []
    let abiError = ''
    try {
        if (abi.trim()) {
            parsedAbi = JSON.parse(abi)
            if (!Array.isArray(parsedAbi)) {
                abiError = 'ABI 必须是数组格式'
            }
        }
    } catch (e) {
        abiError = 'ABI JSON 格式错误'
    }

    const {
        deployContract,
        isPending,
        isConfirming,
        isConfirmed,
        contractAddress,
        error,
        waitError,
        isBytecodeValid,
        isDisabled,
    } = useContractDeploy({
        bytecode,
        abi: parsedAbi.length > 0 ? parsedAbi : undefined,
        args: parsedArgs.length > 0 ? parsedArgs : undefined,
    })

    const handleDeploy = async () => {
        if (argsError || abiError) return
        await deployContract()
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Contract Deployment</h3>
                <div className="space-y-6">
                    {/* Bytecode Input */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Contract Bytecode
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={bytecode}
                                onChange={(e) => setBytecode(e.target.value)}
                                placeholder="0x608060405234801561001057600080fd5b50..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-gray-50 transition-all duration-200 hover:border-gray-300 resize-none"
                                rows={6}
                            />
                            {bytecode && (
                                <div className="absolute top-3 right-3">
                                    {isBytecodeValid ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            Valid
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                            Invalid
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ABI Input */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Contract ABI
                            <span className="text-xs font-normal text-gray-500">(Optional)</span>
                        </label>
                        <textarea
                            value={abi}
                            onChange={(e) => setAbi(e.target.value)}
                            placeholder='[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"}]'
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm bg-gray-50 transition-all duration-200 hover:border-gray-300 resize-none"
                            rows={4}
                        />
                        {abiError && (
                            <p className="mt-2 text-sm text-red-600">{abiError}</p>
                        )}
                    </div>

                    {/* Constructor Arguments Input */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            Constructor Arguments
                            <span className="text-xs font-normal text-gray-500">(Optional)</span>
                        </label>
                        <textarea
                            value={constructorArgs}
                            onChange={(e) => setConstructorArgs(e.target.value)}
                            placeholder='["arg1", 1000]'
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm bg-gray-50 transition-all duration-200 hover:border-gray-300 resize-none"
                            rows={3}
                        />
                        {argsError && (
                            <p className="mt-2 text-sm text-red-600">{argsError}</p>
                        )}
                    </div>

                    {/* Deploy Button */}
                    <button
                        onClick={handleDeploy}
                        disabled={isDisabled || Boolean(argsError) || Boolean(abiError)}
                        className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all transform active:scale-[0.99]
                            ${isDisabled || argsError || abiError
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                            }`}
                    >
                        {isPending ? 'Confirming...' : isConfirming ? 'Deploying...' : 'Deploy Contract'}
                    </button>

                    {/* Status Messages */}
                    {(error || waitError) && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                            <p className="font-medium">Deployment Failed:</p>
                            <p>{(error || waitError)?.message}</p>
                        </div>
                    )}

                    {isConfirmed && contractAddress && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                            <p className="font-medium">Deployed Successfully!</p>
                            <p className="mt-1 break-all">Address: {contractAddress}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

type TabType = 'ERC20' | 'ERC721' | 'ERC1155' | 'Custom'

export function DeployContract() {
    const [activeTab, setActiveTab] = useState<TabType>('ERC20')

    const tabs: { id: TabType; label: string }[] = [
        { id: 'ERC20', label: 'ERC20 Token' },
        { id: 'ERC721', label: 'ERC721 NFT' },
        { id: 'ERC1155', label: 'ERC1155 Multi-Token' },
        { id: 'Custom', label: 'Custom Contract' },
    ]

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-1 shadow-2xl min-h-screen">
            <div className="relative rounded-xl bg-white/80 backdrop-blur-sm p-8 max-w-4xl mx-auto min-h-[600px]">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Smart Contract Deployment
                    </h2>
                    <p className="text-gray-600 mt-2">Easily invoke and deploy your smart contracts</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="transition-all duration-300">
                    {activeTab === 'ERC20' && <DeployERC20 />}
                    {activeTab === 'ERC721' && <DeployERC721 />}
                    {activeTab === 'ERC1155' && <DeployERC1155 />}
                    {activeTab === 'Custom' && <DeployCustom />}
                </div>
            </div>
        </div>
    )
}
