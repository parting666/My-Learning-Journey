import { useReadContract, useAccount } from 'wagmi'
import { TokenFactory } from '../artifacts'
import { TOKEN_FACTORY_ADDRESS } from '../constants/contracts'
import { type Address } from 'viem'

export type DeploymentInfo = {
    tokenAddress: Address
    deployer: Address
    timestamp: bigint
    tokenType: string
    name: string
    symbol: string
}

export const useTokenFactory = () => {
    const { address } = useAccount()

    const { data: deployments, isLoading, error } = useReadContract({
        address: TOKEN_FACTORY_ADDRESS,
        abi: TokenFactory.abi,
        functionName: 'getUserDeployments',
        args: [address as Address],
        query: {
            enabled: !!address && TOKEN_FACTORY_ADDRESS !== '0x0000000000000000000000000000000000000000',
        }
    })

    const userDeployments = (deployments as any[]) || []

    // Helper to map struct to DeploymentInfo
    // Note: Depends on wagmi/viem return structure (usually object or array)
    // Assuming the ABI update propagates and wagmi returns objects since we have the Artifact
    const parsedDeployments: DeploymentInfo[] = userDeployments.map((d: any) => ({
        tokenAddress: d.tokenAddress || d[0],
        deployer: d.deployer || d[1],
        timestamp: d.timestamp || d[2],
        tokenType: d.tokenType || d[3],
        name: d.name || d[4],
        symbol: d.symbol || d[5],
    }))

    const userERC20s = parsedDeployments.filter(d => d.tokenType === 'ERC20')
    const userERC721s = parsedDeployments.filter(d => d.tokenType === 'ERC721')
    const userERC1155s = parsedDeployments.filter(d => d.tokenType === 'ERC1155')

    return {
        deployments: parsedDeployments,
        userERC20s,
        userERC721s,
        userERC1155s,
        isLoading,
        error
    }
}
