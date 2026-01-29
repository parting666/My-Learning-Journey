<template>
  <div class="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-900">Manage ERC1155 Multi-Token</h3>
      <div class="text-right">
        <p class="text-sm text-gray-500">Contract Address</p>
        <p class="text-xs font-mono text-indigo-600 break-all">{{ address }}</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500 animate-pulse">Loading contract data...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Collection Name</p>
            <p class="font-semibold text-gray-900">{{ tokenData.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Symbol</p>
            <p class="font-semibold text-gray-900">{{ tokenData.symbol }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="font-semibold text-gray-900">Actions</h4>
        
        <div class="p-4 border border-gray-200 rounded-lg">
          <h5 class="text-sm font-medium text-gray-700 mb-3">Check Balance</h5>
          <div class="flex gap-3">
            <input
              v-model.number="balanceTokenId"
              type="number"
              placeholder="Token ID"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <button
              @click="getBalance"
              :disabled="isGettingBalance || balanceTokenId === null"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            >
              {{ isGettingBalance ? 'Loading...' : 'Get Balance' }}
            </button>
          </div>
          <p v-if="balanceResult !== null" class="mt-2 text-sm text-indigo-600 font-semibold">
            Balance: {{ balanceResult }}
          </p>
        </div>

        <div class="p-4 border border-gray-200 rounded-lg">
          <h5 class="text-sm font-medium text-gray-700 mb-3">Mint Tokens (Owner Only)</h5>
          <div class="grid grid-cols-3 gap-3 mb-3">
            <input
              v-model="mintTo"
              type="text"
              placeholder="Recipient (0x...)"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <input
              v-model.number="mintTokenId"
              type="number"
              placeholder="Token ID"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <input
              v-model.number="mintAmount"
              type="number"
              placeholder="Amount"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
          </div>
          <button
            @click="mintTokens"
            :disabled="isMinting || !mintTo || mintTokenId === null || !mintAmount"
            class="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            {{ isMinting ? 'Minting...' : 'Mint' }}
          </button>
          <p v-if="mintStatus" class="mt-2 text-sm" :class="mintStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'">
            {{ mintStatus }}
          </p>
        </div>

        <div class="p-4 border border-gray-200 rounded-lg">
          <h5 class="text-sm font-medium text-gray-700 mb-3">Transfer Tokens</h5>
          <div class="space-y-3">
            <input
              v-model="transferTo"
              type="text"
              placeholder="Recipient address (0x...)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <div class="grid grid-cols-3 gap-3">
              <input
                v-model.number="transferTokenId"
                type="number"
                placeholder="Token ID"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
              <input
                v-model.number="transferAmount"
                type="number"
                placeholder="Amount"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
              <button
                @click="transferTokens"
                :disabled="isTransferring || !transferTo || transferTokenId === null || !transferAmount"
                class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {{ isTransferring ? 'Transferring...' : 'Transfer' }}
              </button>
            </div>
          </div>
          <p v-if="transferStatus" class="mt-2 text-sm" :class="transferStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'">
            {{ transferStatus }}
          </p>
        </div>

        <div class="p-4 border border-gray-200 rounded-lg">
          <h5 class="text-sm font-medium text-gray-700 mb-3">Get URI</h5>
          <div class="flex gap-3">
            <input
              v-model.number="uriTokenId"
              type="number"
              placeholder="Token ID"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <button
              @click="getURI"
              :disabled="isGettingURI || uriTokenId === null"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            >
              {{ isGettingURI ? 'Loading...' : 'Get URI' }}
            </button>
          </div>
          <p v-if="uriResult" class="mt-2 text-sm text-indigo-600 break-all font-mono">
            {{ uriResult }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ethers } from 'ethers'
import { useWallet } from '@/hooks/useWallet'

const props = defineProps<{
  address: string
}>()

const { account, provider } = useWallet()

const loading = ref(true)
const error = ref('')
const tokenData = ref({
  name: 'Unknown',
  symbol: 'Unknown'
})

const balanceTokenId = ref<number | null>(null)
const isGettingBalance = ref(false)
const balanceResult = ref<number | null>(null)

const mintTo = ref('')
const mintTokenId = ref<number | null>(null)
const mintAmount = ref<number | null>(null)
const isMinting = ref(false)
const mintStatus = ref('')

const transferTo = ref('')
const transferTokenId = ref<number | null>(null)
const transferAmount = ref<number | null>(null)
const isTransferring = ref(false)
const transferStatus = ref('')

const uriTokenId = ref<number | null>(null)
const isGettingURI = ref(false)
const uriResult = ref('')

const loadContractData = async () => {
  if (!provider.value || !props.address) return

  loading.value = true
  error.value = ''

  try {
    const contractABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function uri(uint256) view returns (string)'
    ]

    const contract = new ethers.Contract(props.address, contractABI, provider.value)

    const [name, symbol] = await Promise.all([
      contract.name?.() ?? 'Unknown',
      contract.symbol?.() ?? 'Unknown'
    ])

    tokenData.value = {
      name,
      symbol
    }
  } catch (e: any) {
    error.value = `Failed to load contract: ${e.message || 'Unknown error'}`
    console.error('Error loading contract:', e)
  } finally {
    loading.value = false
  }
}

const getBalance = async () => {
  if (balanceTokenId.value === null || !account.value || !provider.value) return

  isGettingBalance.value = true
  balanceResult.value = null

  try {
    const contractABI = [
      'function balanceOf(address, uint256) view returns (uint256)'
    ]

    const contract = new ethers.Contract(props.address, contractABI, provider.value)
    
    const balance = await contract.balanceOf?.(account.value, balanceTokenId.value) ?? '0'
    balanceResult.value = parseInt(balance.toString())
  } catch (e: any) {
    balanceResult.value = 0
    console.error('Error getting balance:', e)
  } finally {
    isGettingBalance.value = false
  }
}

const mintTokens = async () => {
  if (!account.value || !mintTo.value || mintTokenId.value === null || !mintAmount.value || !provider.value) return

  isMinting.value = true
  mintStatus.value = ''

  try {
    const contractABI = [
      'function mint(address, uint256, uint256, bytes)'
    ]

    const signer = await provider.value.getSigner()
    const contract = new ethers.Contract(props.address, contractABI, signer)
    
    const tx = await contract.mint?.(mintTo.value, mintTokenId.value, mintAmount.value, '0x')
    
    if (tx) {
      mintStatus.value = 'Minting... Please confirm in wallet'
      await tx.wait()
      mintStatus.value = 'Successfully minted!'
    }
    
    mintTo.value = ''
    mintTokenId.value = null
    mintAmount.value = null
    
    await loadContractData()
  } catch (e: any) {
    mintStatus.value = `Failed: ${e.message || 'Unknown error'}`
    console.error('Error minting:', e)
  } finally {
    isMinting.value = false
  }
}

const transferTokens = async () => {
  if (!account.value || !transferTo.value || transferTokenId.value === null || !transferAmount.value || !provider.value) return

  isTransferring.value = true
  transferStatus.value = ''

  try {
    const contractABI = [
      'function safeTransferFrom(address, address, uint256, uint256, bytes)'
    ]

    const signer = await provider.value.getSigner()
    const contract = new ethers.Contract(props.address, contractABI, signer)
    
    const tx = await contract.safeTransferFrom?.(account.value, transferTo.value, transferTokenId.value, transferAmount.value, '0x')
    
    if (tx) {
      transferStatus.value = 'Transferring... Please confirm in wallet'
      await tx.wait()
      transferStatus.value = 'Successfully transferred!'
    }
    
    transferTo.value = ''
    transferTokenId.value = null
    transferAmount.value = null
    
    await loadContractData()
  } catch (e: any) {
    transferStatus.value = `Failed: ${e.message || 'Unknown error'}`
    console.error('Error transferring:', e)
  } finally {
    isTransferring.value = false
  }
}

const getURI = async () => {
  if (uriTokenId.value === null || !provider.value) return

  isGettingURI.value = true
  uriResult.value = ''

  try {
    const contractABI = [
      'function uri(uint256) view returns (string)'
    ]

    const contract = new ethers.Contract(props.address, contractABI, provider.value)
    
    const uri = await contract.uri?.(uriTokenId.value) ?? ''
    uriResult.value = uri || 'Token does not exist'
  } catch (e: any) {
    uriResult.value = `Error: ${e.message || 'Unknown error'}`
    console.error('Error getting URI:', e)
  } finally {
    isGettingURI.value = false
  }
}

onMounted(() => {
  loadContractData()
})

watch(() => props.address, () => {
  loadContractData()
})
</script>
