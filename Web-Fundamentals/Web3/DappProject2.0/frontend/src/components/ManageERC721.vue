<template>
  <div class="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-900">Manage ERC721 NFT</h3>
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
          <div>
            <p class="text-sm text-gray-500">Total Supply</p>
            <p class="font-semibold text-gray-900">{{ tokenData.totalSupply }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Your Balance</p>
            <p class="font-semibold text-indigo-600">{{ tokenData.balance }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="font-semibold text-gray-900">Actions</h4>
        
        <div class="p-4 border border-gray-200 rounded-lg">
          <h5 class="text-sm font-medium text-gray-700 mb-3">Mint NFT (Owner Only)</h5>
          <div class="flex gap-3">
            <input
              v-model="mintTo"
              type="text"
              placeholder="Recipient address (0x...)"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <input
              v-model.number="mintTokenId"
              type="number"
              placeholder="Token ID"
              class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <button
              @click="mintNFT"
              :disabled="isMinting || !mintTo || mintTokenId === null"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              {{ isMinting ? 'Minting...' : 'Mint' }}
            </button>
          </div>
          <p v-if="mintStatus" class="mt-2 text-sm" :class="mintStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'">
            {{ mintStatus }}
          </p>
        </div>

        <div class="p-4 border border-gray-200 rounded-lg">
          <h5 class="text-sm font-medium text-gray-700 mb-3">Transfer NFT</h5>
          <div class="space-y-3">
            <input
              v-model="transferTo"
              type="text"
              placeholder="Recipient address (0x...)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <div class="flex gap-3">
              <input
                v-model.number="transferTokenId"
                type="number"
                placeholder="Token ID"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
              <button
                @click="transferNFT"
                :disabled="isTransferring || !transferTo || transferTokenId === null"
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
          <h5 class="text-sm font-medium text-gray-700 mb-3">Get Token URI</h5>
          <div class="flex gap-3">
            <input
              v-model.number="queryTokenId"
              type="number"
              placeholder="Token ID"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <button
              @click="getTokenURI"
              :disabled="isQuerying || queryTokenId === null"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            >
              {{ isQuerying ? 'Loading...' : 'Query' }}
            </button>
          </div>
          <p v-if="tokenURI" class="mt-2 text-sm text-indigo-600 break-all font-mono">
            {{ tokenURI }}
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
  symbol: 'Unknown',
  totalSupply: '0',
  balance: '0'
})

const mintTo = ref('')
const mintTokenId = ref<number | null>(null)
const isMinting = ref(false)
const mintStatus = ref('')

const transferTo = ref('')
const transferTokenId = ref<number | null>(null)
const isTransferring = ref(false)
const transferStatus = ref('')

const queryTokenId = ref<number | null>(null)
const isQuerying = ref(false)
const tokenURI = ref('')

const loadContractData = async () => {
  if (!provider.value || !props.address) return

  loading.value = true
  error.value = ''

  try {
    const contractABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function balanceOf(address) view returns (uint256)',
      'function tokenURI(uint256) view returns (string)',
      'function ownerOf(uint256) view returns (address)',
      'function totalSupply() view returns (uint256)',
      'function mint(address, uint256)',
      'function transferFrom(address, address, uint256)'
    ]

    const contract = new ethers.Contract(props.address, contractABI, provider.value)

    const [name, symbol] = await Promise.all([
      contract.name?.() ?? 'Unknown',
      contract.symbol?.() ?? 'Unknown'
    ])

    tokenData.value = {
      name,
      symbol,
      totalSupply: 'N/A',
      balance: '0'
    }

    if (account.value) {
      const balance = await contract.balanceOf?.(account.value) ?? '0'
      tokenData.value.balance = balance.toString()
    }
  } catch (e: any) {
    error.value = `Failed to load contract: ${e.message || 'Unknown error'}`
    console.error('Error loading contract:', e)
  } finally {
    loading.value = false
  }
}

const mintNFT = async () => {
  if (!account.value || !mintTo.value || mintTokenId.value === null || !provider.value) return

  isMinting.value = true
  mintStatus.value = ''

  try {
    const contractABI = [
      'function mint(address, uint256)'
    ]

    const signer = await provider.value.getSigner()
    const contract = new ethers.Contract(props.address, contractABI, signer)
    
    const tx = await contract.mint?.(mintTo.value, mintTokenId.value)
    
    if (tx) {
      mintStatus.value = 'Minting... Please confirm in wallet'
      await tx.wait()
      mintStatus.value = 'Successfully minted!'
    }
    
    mintTo.value = ''
    mintTokenId.value = null
    
    await loadContractData()
  } catch (e: any) {
    mintStatus.value = `Failed: ${e.message || 'Unknown error'}`
    console.error('Error minting:', e)
  } finally {
    isMinting.value = false
  }
}

const transferNFT = async () => {
  if (!account.value || !transferTo.value || transferTokenId.value === null || !provider.value) return

  isTransferring.value = true
  transferStatus.value = ''

  try {
    const contractABI = [
      'function transferFrom(address, address, uint256)'
    ]

    const signer = await provider.value.getSigner()
    const contract = new ethers.Contract(props.address, contractABI, signer)
    
    const tx = await contract.transferFrom?.(account.value, transferTo.value, transferTokenId.value)
    
    if (tx) {
      transferStatus.value = 'Transferring... Please confirm in wallet'
      await tx.wait()
      transferStatus.value = 'Successfully transferred!'
    }
    
    transferTo.value = ''
    transferTokenId.value = null
    
    await loadContractData()
  } catch (e: any) {
    transferStatus.value = `Failed: ${e.message || 'Unknown error'}`
    console.error('Error transferring:', e)
  } finally {
    isTransferring.value = false
  }
}

const getTokenURI = async () => {
  if (queryTokenId.value === null || !provider.value) return

  isQuerying.value = true
  tokenURI.value = ''

  try {
    const contractABI = [
      'function tokenURI(uint256) view returns (string)'
    ]

    const contract = new ethers.Contract(props.address, contractABI, provider.value)
    
    const uri = await contract.tokenURI?.(queryTokenId.value) ?? ''
    tokenURI.value = uri || 'Token does not exist'
  } catch (e: any) {
    tokenURI.value = `Error: ${e.message || 'Unknown error'}`
    console.error('Error getting token URI:', e)
  } finally {
    isQuerying.value = false
  }
}

onMounted(() => {
  loadContractData()
})

watch(() => props.address, () => {
  loadContractData()
})
</script>
