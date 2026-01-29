import { ref, onMounted } from 'vue'

export type LocalDeployment = {
    contractAddress: string
    name: string
    symbol: string
    tokenType: 'ERC20' | 'ERC721' | 'ERC1155'
    timestamp: number
}

const STORAGE_KEY = 'antigravity_deployed_contracts'

export function useLocalContracts() {
    const contracts = ref<LocalDeployment[]>([])

    const loadContracts = () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                contracts.value = JSON.parse(stored)
            } catch (e) {
                console.error('Failed to parse local contracts', e)
                contracts.value = []
            }
        }
    }

    const addContract = (deployment: LocalDeployment) => {
        const updated = [...contracts.value, deployment]
        // De-duplicate by address
        const unique = updated.filter((v, i, a) => a.findIndex(t => t.contractAddress === v.contractAddress) === i)

        contracts.value = unique
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unique))
    }

    const clearContracts = () => {
        contracts.value = []
        localStorage.removeItem(STORAGE_KEY)
    }

    const getContractsByType = (type: 'ERC20' | 'ERC721' | 'ERC1155') => {
        return contracts.value
            .filter(c => c.tokenType === type)
            .sort((a, b) => b.timestamp - a.timestamp)
    }

    onMounted(() => {
        loadContracts()
    })

    return {
        contracts,
        addContract,
        clearContracts,
        getContractsByType
    }
}
