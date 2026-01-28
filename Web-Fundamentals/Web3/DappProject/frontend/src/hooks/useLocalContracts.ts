import { useState, useEffect } from 'react'

export type LocalDeployment = {
    contractAddress: string
    name: string
    symbol: string
    tokenType: 'ERC20' | 'ERC721' | 'ERC1155'
    timestamp: number
}

const STORAGE_KEY = 'antigravity_deployed_contracts'

export const useLocalContracts = () => {
    const [contracts, setContracts] = useState<LocalDeployment[]>([])

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                setContracts(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse local contracts', e)
                setContracts([])
            }
        }
    }, [])

    const addContract = (deployment: LocalDeployment) => {
        const updated = [...contracts, deployment]
        // Simple de-duplication by address
        const unique = updated.filter((v, i, a) => a.findIndex(t => t.contractAddress === v.contractAddress) === i)

        setContracts(unique)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unique))
    }

    const clearContracts = () => {
        setContracts([])
        localStorage.removeItem(STORAGE_KEY)
    }

    const getContractsByType = (type: 'ERC20' | 'ERC721' | 'ERC1155') => {
        return contracts.filter(c => c.tokenType === type).sort((a, b) => b.timestamp - a.timestamp)
    }

    return {
        contracts,
        addContract,
        clearContracts,
        getContractsByType
    }
}
