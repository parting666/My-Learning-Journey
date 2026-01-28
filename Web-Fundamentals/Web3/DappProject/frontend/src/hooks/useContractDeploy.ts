import { type Hex } from 'viem'
import { useDeployContract, useWaitForTransactionReceipt } from 'wagmi'

export type UseContractDeployParams = {
    bytecode: string
    abi?: any[]
    args?: any[]
}

export function useContractDeploy({ bytecode, abi, args }: UseContractDeployParams) {
    const deploy = useDeployContract()

    // Validate bytecode format
    const isBytecodeValid = Boolean(bytecode) && bytecode.startsWith('0x') && bytecode.length > 2

    const deployContract = async () => {
        if (!isBytecodeValid) return

        await deploy.deployContract({
            bytecode: bytecode as Hex,
            abi: abi || [],
            args: args || [],
        })
    }

    const txHash = deploy.data
    const wait = useWaitForTransactionReceipt({
        hash: txHash,
        query: { enabled: Boolean(txHash) },
    })

    // Extract deployed contract address from receipt
    const contractAddress = wait.data?.contractAddress

    return {
        deployContract,
        isPending: deploy.isPending,
        data: deploy.data,
        error: deploy.error,
        txHash,
        isConfirming: wait.isLoading,
        isConfirmed: wait.isSuccess,
        receipt: wait.data,
        waitError: wait.error,
        contractAddress,
        isBytecodeValid,
        isDisabled: !isBytecodeValid || deploy.isPending,
    }
}
