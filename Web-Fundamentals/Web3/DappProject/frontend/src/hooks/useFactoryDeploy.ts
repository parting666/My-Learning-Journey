import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEventLogs, type Hex } from 'viem'
import { TokenFactory } from '../artifacts'
import { TOKEN_FACTORY_ADDRESS } from '../constants/contracts'

type FactoryDeployReturn = {
    deployERC20: (name: string, symbol: string, supply: bigint, decimals: number) => void
    deployERC721: (name: string, symbol: string, baseURI: string) => void
    deployERC1155: (name: string, symbol: string, baseURI: string) => void
    isPending: boolean
    isConfirming: boolean
    isConfirmed: boolean
    error: Error | null
    contractAddress: string
    txHash: Hex | undefined
}

export function useFactoryDeploy(): FactoryDeployReturn {
    const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt, error: waitError } = useWaitForTransactionReceipt({
        hash
    })

    const [deployedAddress, setDeployedAddress] = useState<string>('')

    useEffect(() => {
        if (receipt && isConfirmed) {
            // Parse logs to find the deployed address
            const logs = parseEventLogs({
                abi: TokenFactory.abi,
                eventName: ['ERC20Deployed', 'ERC721Deployed', 'ERC1155Deployed'],
                logs: receipt.logs,
            })

            if (logs.length > 0) {
                // The first arg is the token address
                // Cast to any to avoid complex Log typing issues
                setDeployedAddress((logs[0] as any).args.tokenAddress)
            }
        }
    }, [receipt, isConfirmed])

    const deployERC20 = (name: string, symbol: string, supply: bigint, decimals: number) => {
        setDeployedAddress('')
        writeContract({
            address: TOKEN_FACTORY_ADDRESS,
            abi: TokenFactory.abi,
            functionName: 'deployERC20',
            args: [name, symbol, supply, decimals],
        })
    }

    const deployERC721 = (name: string, symbol: string, baseURI: string) => {
        setDeployedAddress('')
        writeContract({
            address: TOKEN_FACTORY_ADDRESS,
            abi: TokenFactory.abi,
            functionName: 'deployERC721',
            args: [name, symbol, baseURI],
        })
    }

    const deployERC1155 = (name: string, symbol: string, baseURI: string) => {
        setDeployedAddress('')
        writeContract({
            address: TOKEN_FACTORY_ADDRESS,
            abi: TokenFactory.abi,
            functionName: 'deployERC1155',
            args: [name, symbol, baseURI],
        })
    }

    return {
        deployERC20,
        deployERC721,
        deployERC1155,
        isPending,
        isConfirming,
        isConfirmed,
        error: (writeError || waitError) as Error | null,
        contractAddress: deployedAddress,
        txHash: hash,
    }
}
