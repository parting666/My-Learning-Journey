<template>
  <div class="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
    <h3 class="text-xl font-bold mb-6 text-gray-900">Deploy ERC721 NFT</h3>
    <form @submit.prevent="deployNFT" class="space-y-4">
      <div>
        <label for="collectionName" class="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
        <input 
          type="text" 
          id="collectionName" 
          v-model="collectionName" 
          placeholder="e.g. My NFT Collection"
          class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
          required
        >
      </div>
      <div>
        <label for="collectionSymbol" class="block text-sm font-medium text-gray-700 mb-1">Collection Symbol</label>
        <input 
          type="text" 
          id="collectionSymbol" 
          v-model="collectionSymbol" 
          placeholder="e.g. NFT"
          class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
          required
        >
      </div>
      <div>
        <label for="baseURI" class="block text-sm font-medium text-gray-700 mb-1">Base URI (Optional)</label>
        <input 
          type="url" 
          id="baseURI" 
          v-model="baseURI" 
          placeholder="https://api.example.com/metadata/"
          class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
        >
        <p class="mt-1 text-xs text-gray-500">Token IDs will be appended to this URI</p>
      </div>
      <button 
        type="submit" 
        :disabled="isDeploying"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
      >
        {{ isDeploying ? 'Deploying...' : 'Deploy' }}
      </button>
    </form>

    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <div v-if="lastDeployedAddress" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-green-800 font-medium">Deployment Success!</p>
      <p class="text-green-600 text-sm break-all font-mono mt-1">{{ lastDeployedAddress }}</p>
    </div>

    <div v-if="userERC721s.length > 0" class="mt-10 pt-6 border-t border-gray-100">
      <h4 class="text-lg font-semibold text-gray-900 mb-4">Your Deployed NFTs (Local)</h4>
      <div class="space-y-3">
        <div 
          v-for="contract in userERC721s" 
          :key="contract.contractAddress"
          @click="selectContract(contract.contractAddress)"
          class="p-4 rounded-xl border border-gray-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all flex justify-between items-center"
          :class="{ 'border-purple-600 bg-purple-50': selectedAddress === contract.contractAddress }"
        >
          <div class="flex flex-col">
            <span class="text-gray-900 font-medium">{{ contract.name }} ({{ contract.symbol }})</span>
            <span class="text-xs text-gray-500 font-mono">{{ contract.contractAddress }}</span>
          </div>
          <span v-if="selectedAddress === contract.contractAddress" class="text-xs font-semibold text-purple-600">Selected</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import { MyERC721Token } from '@/artifacts/MyERC721Token'
import { useWallet } from '@/hooks/useWallet'
import { useLocalContracts } from '@/hooks/useLocalContracts'

const collectionName = ref('')
const collectionSymbol = ref('')
const baseURI = ref('')
const isDeploying = ref(false)
const lastDeployedAddress = ref('')
const selectedAddress = ref('')
const error = ref('')

const { signer } = useWallet()
const { addContract, getContractsByType } = useLocalContracts()

const userERC721s = computed(() => getContractsByType('ERC721'))

const selectContract = (address: string) => {
  selectedAddress.value = address
  console.log('Selected contract for operations:', address)
}

const deployNFT = async () => {
  if (!signer.value) {
    error.value = 'Please connect your wallet first.'
    return
  }

  isDeploying.value = true
  lastDeployedAddress.value = ''
  error.value = ''

  try {
    const factory = new ethers.ContractFactory(
      MyERC721Token.abi, 
      MyERC721Token.bytecode, 
      signer.value
    )
    
    const contract = await factory.deploy(collectionName.value, collectionSymbol.value, baseURI.value || '')
    await contract.waitForDeployment()
    
    const address = await contract.getAddress()
    lastDeployedAddress.value = address
    
    addContract({
      contractAddress: address,
      name: collectionName.value,
      symbol: collectionSymbol.value,
      tokenType: 'ERC721',
      timestamp: Date.now()
    })

    collectionName.value = ''
    collectionSymbol.value = ''
    baseURI.value = ''
  } catch (err: any) {
    console.error('Error deploying NFT:', err)
    error.value = err.message || 'Error deploying NFT. See console for details.'
  } finally {
    isDeploying.value = false
  }
}
</script>
