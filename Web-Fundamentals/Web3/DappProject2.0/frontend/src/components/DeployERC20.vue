<template>
  <div class="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
    <h3 class="text-xl font-bold mb-6 text-gray-900">Deploy ERC20 Token</h3>
    <form @submit.prevent="deployToken" class="space-y-4">
      <div>
        <label for="tokenName" class="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
        <input 
          type="text" 
          id="tokenName" 
          v-model="tokenName" 
          placeholder="e.g. My Token"
          class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
          required
        >
      </div>
      <div>
        <label for="tokenSymbol" class="block text-sm font-medium text-gray-700 mb-1">Token Symbol</label>
        <input 
          type="text" 
          id="tokenSymbol" 
          v-model="tokenSymbol" 
          placeholder="e.g. MTK"
          class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
          required
        >
      </div>
      <div>
        <label for="initialSupply" class="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
        <input 
          type="number" 
          id="initialSupply" 
          v-model="initialSupply" 
          placeholder="1000000"
          class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400" 
          required
        >
      </div>
      <div>
        <label for="decimals" class="block text-sm font-medium text-gray-700 mb-1">Decimals</label>
        <input 
          type="number" 
          id="decimals" 
          v-model="decimals" 
          placeholder="18"
          class="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400" 
          required
        >
      </div>
      <button 
        type="submit" 
        :disabled="isDeploying"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
      >
        {{ isDeploying ? 'Deploying...' : 'Deploy' }}
      </button>
    </form>

    <!-- Success Message -->
    <div v-if="lastDeployedAddress" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-green-800 font-medium">Deployment Success!</p>
      <p class="text-green-600 text-sm break-all font-mono mt-1">{{ lastDeployedAddress }}</p>
    </div>

    <!-- Local History -->
    <div v-if="userERC20s.length > 0" class="mt-10 pt-6 border-t border-gray-100">
      <h4 class="text-lg font-semibold text-gray-900 mb-4">Your Deployed Contracts (Local)</h4>
      <div class="space-y-3">
        <div 
          v-for="contract in userERC20s" 
          :key="contract.contractAddress"
          @click="selectContract(contract.contractAddress)"
          class="p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-all flex justify-between items-center"
          :class="{ 'border-indigo-600 bg-indigo-50': selectedAddress === contract.contractAddress }"
        >
          <div class="flex flex-col">
            <span class="text-gray-900 font-medium">{{ contract.name }} ({{ contract.symbol }})</span>
            <span class="text-xs text-gray-500 font-mono">{{ contract.contractAddress }}</span>
          </div>
          <span v-if="selectedAddress === contract.contractAddress" class="text-xs font-semibold text-indigo-600">Selected</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { ethers } from 'ethers'
import { MyERC20Token } from '@/artifacts/MyERC20Token'
import { useWallet } from '@/hooks/useWallet'
import { useLocalContracts } from '@/hooks/useLocalContracts'

const tokenName = ref('')
const tokenSymbol = ref('')
const initialSupply = ref(0)
const decimals = ref(18)
const isDeploying = ref(false)
const lastDeployedAddress = ref('')
const selectedAddress = ref('')

const { signer } = useWallet()
const { addContract, getContractsByType } = useLocalContracts()

const userERC20s = computed(() => getContractsByType('ERC20'))

const selectContract = (address: string) => {
  selectedAddress.value = address
  console.log('Selected contract for operations:', address)
}

const deployToken = async () => {
  if (!signer.value) {
    alert('Please connect your wallet first.')
    return
  }

  isDeploying.value = true
  lastDeployedAddress.value = ''

  try {
    const factory = new ethers.ContractFactory(
      MyERC20Token.abi, 
      MyERC20Token.bytecode, 
      toRaw(signer.value)
    )
    
    const initParams = [
      tokenName.value, 
      tokenSymbol.value, 
      initialSupply.value.toString(), 
      decimals.value
    ]
    
    const contract = await factory.deploy(...initParams)
    await contract.waitForDeployment()
    
    const address = await contract.getAddress()
    lastDeployedAddress.value = address
    
    // Save to local storage
    addContract({
      contractAddress: address,
      name: tokenName.value,
      symbol: tokenSymbol.value,
      tokenType: 'ERC20',
      timestamp: Date.now()
    })

    // Reset form
    tokenName.value = ''
    tokenSymbol.value = ''
    initialSupply.value = 0
  } catch (error) {
    console.error('Error deploying token:', error)
    alert('Error deploying token. See console for details.')
  } finally {
    isDeploying.value = false
  }
}
</script>
