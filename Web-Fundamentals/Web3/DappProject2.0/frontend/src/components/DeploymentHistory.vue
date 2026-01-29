<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 border-b border-gray-100">
      <h3 class="font-bold text-gray-900">Deployment History</h3>
      <p class="text-sm text-gray-500">Your deployed contracts</p>
    </div>

    <div v-if="loading" class="p-8 text-center">
      <p class="text-gray-500 animate-pulse">Loading deployment history...</p>
    </div>

    <div v-else-if="contracts.length === 0" class="p-8 text-center">
      <div class="text-gray-400 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-gray-500">No deployments found yet</p>
      <RouterLink to="/deploy" class="mt-4 inline-block text-indigo-600 font-bold hover:underline">
        Deploy your first token →
      </RouterLink>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="contract in contracts"
        :key="contract.contractAddress"
        class="p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="[
              getTokenTypeClass(contract.tokenType),
              'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm'
            ]">
              {{ contract.tokenType.slice(-3) }}
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ contract.name }}</p>
              <p class="text-xs text-gray-500 font-mono">{{ contract.contractAddress.slice(0, 10) }}...{{ contract.contractAddress.slice(-8) }}</p>
            </div>
          </div>
          <div class="text-right">
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
              getTokenTypeBadgeClass(contract.tokenType)
            ]">
              {{ contract.tokenType }}
            </span>
            <p class="text-xs text-gray-400 mt-1">{{ formatDate(contract.timestamp) }}</p>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="$emit('view-contract', contract)"
            class="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
          >
            View
          </button>
          <a
            v-if="getExplorerUrl(contract.contractAddress)"
            :href="getExplorerUrl(contract.contractAddress)"
            target="_blank"
            class="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Explorer ↗
          </a>
        </div>
      </div>
    </div>

    <div v-if="contracts.length > 0" class="p-4 border-t border-gray-100 bg-gray-50">
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-500">{{ contracts.length }} deployment(s)</span>
        <button
          @click="clearHistory"
          class="text-red-600 hover:text-red-800 font-medium"
        >
          Clear History
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLocalContracts, type LocalDeployment } from '@/hooks/useLocalContracts'
import { useWallet } from '@/hooks/useWallet'

const props = defineProps<{
  factoryAddress?: string
}>()

const emit = defineEmits<{
  (e: 'view-contract', contract: LocalDeployment): void
}>()

const { contracts, clearContracts } = useLocalContracts()
const { chainId, SUPPORTED_NETWORKS } = useWallet()

const loading = computed(() => false)

const getTokenTypeClass = (tokenType: string) => {
  switch (tokenType) {
    case 'ERC20':
      return 'bg-blue-100 text-blue-600'
    case 'ERC721':
      return 'bg-purple-100 text-purple-600'
    case 'ERC1155':
      return 'bg-cyan-100 text-cyan-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getTokenTypeBadgeClass = (tokenType: string) => {
  switch (tokenType) {
    case 'ERC20':
      return 'bg-blue-100 text-blue-700'
    case 'ERC721':
      return 'bg-purple-100 text-purple-700'
    case 'ERC1155':
      return 'bg-cyan-100 text-cyan-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getExplorerUrl = (address: string) => {
  if (!chainId.value) return ''
  const hexChainId = `0x${chainId.value.toString(16)}`
  const network = (SUPPORTED_NETWORKS as any)[hexChainId]
  if (network && network.blockExplorerUrls && network.blockExplorerUrls.length > 0) {
    return `${network.blockExplorerUrls[0]}address/${address}`
  }
  return ''
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}

const clearHistory = () => {
  if (confirm('Are you sure you want to clear all deployment history?')) {
    clearContracts()
  }
}

onMounted(() => {
  console.log('DeploymentHistory mounted, contracts:', contracts.value)
})
</script>
