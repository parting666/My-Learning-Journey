<template>
  <div class="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-900">Manage ERC20 Token</h3>
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
            <p class="text-sm text-gray-500">Token Name</p>
            <p class="font-semibold text-gray-900">{{ tokenData.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Symbol</p>
            <p class="font-semibold text-gray-900">{{ tokenData.symbol }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Decimals</p>
            <p class="font-semibold text-gray-900">{{ tokenData.decimals }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Supply</p>
            <p class="font-semibold text-gray-900">{{ formattedTotalSupply }}</p>
          </div>
        </div>
      </div>

      <div v-if="account" class="bg-gray-50 rounded-lg p-4">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-semibold text-gray-900">Your Balance</h4>
          <p class="text-lg font-bold text-indigo-600">{{ formattedBalance }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="font-semibold text-gray-900">Actions</h4>
        
        <div class="p-4 border border-gray-200 rounded-lg">
          <h5 class="text-sm font-medium text-gray-700 mb-3">Mint Tokens (Owner Only)</h5>
          <div class="flex gap-3">
            <input
              v-model.number="mintAmount"
              type="number"
              placeholder="Amount"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <button
              @click="mintTokens"
              :disabled="isMinting || !mintAmount"
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
          <h5 class="text-sm font-medium text-gray-700 mb-3">Transfer Tokens</h5>
          <div class="space-y-3">
            <input
              v-model="transferTo"
              type="text"
              placeholder="Recipient address (0x...)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
            <div class="flex gap-3">
              <input
                v-model.number="transferAmount"
                type="number"
                placeholder="Amount"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
              <button
                @click="transferTokens"
                :disabled="isTransferring || !transferTo || !transferAmount"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ethers } from 'ethers'
import { useWallet } from '@/hooks/useWallet'

const props = defineProps<{
  address: string
}>()

const { account, provider } = useWallet()

const loading = ref(true)
const error = ref('')
const tokenData = ref({
  name: '',
  symbol: '',
  decimals: 18,
  totalSupply: '0',
  balance: '0'
})

const mintAmount = ref<number | null>(null)
const isMinting = ref(false)
const mintStatus = ref('')

const transferTo = ref('')
const transferAmount = ref<number | null>(null)
const isTransferring = ref(false)
const transferStatus = ref('')

const formattedBalance = computed(() => {
  try {
    return parseFloat(ethers.formatUnits(tokenData.value.balance, tokenData.value.decimals)).toFixed(4)
  } catch {
    return '0'
  }
})

const formattedTotalSupply = computed(() => {
  try {
    return parseFloat(ethers.formatUnits(tokenData.value.totalSupply, tokenData.value.decimals)).toLocaleString()
  } catch {
    return '0'
  }
})

const loadContractData = async () => {
  if (!provider.value || !props.address) return

  loading.value = true
  error.value = ''

  try {
    const contractABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)'
    ]

    const contract = new ethers.Contract(props.address, contractABI, provider.value)

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name?.() ?? 'Unknown',
      contract.symbol?.() ?? 'Unknown',
      contract.decimals?.() ?? 18,
      contract.totalSupply?.() ?? '0'
    ])

    tokenData.value = {
      name,
      symbol,
      decimals,
      totalSupply: totalSupply.toString(),
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

const mintTokens = async () => {
  if (!account.value || !mintAmount.value || mintAmount.value <= 0 || !provider.value) return

  isMinting.value = true
  mintStatus.value = ''

  try {
    const contractABI = [
      'function mint(uint256)'
    ]

    const signer = await provider.value.getSigner()
    const contract = new ethers.Contract(props.address, contractABI, signer)
    
    const amount = ethers.parseUnits(mintAmount.value.toString(), tokenData.value.decimals)
    const tx = await contract.mint?.(amount)
    
    if (tx) {
      mintStatus.value = 'Minting... Please confirm in wallet'
      await tx.wait()
      mintStatus.value = 'Successfully minted!'
    }
    
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
  if (!account.value || !transferTo.value || !transferAmount.value || transferAmount.value <= 0 || !provider.value) return

  isTransferring.value = true
  transferStatus.value = ''

  try {
    const contractABI = [
      'function transfer(address, uint256) returns (bool)'
    ]

    const signer = await provider.value.getSigner()
    const contract = new ethers.Contract(props.address, contractABI, signer)
    
    const amount = ethers.parseUnits(transferAmount.value.toString(), tokenData.value.decimals)
    const tx = await contract.transfer?.(transferTo.value, amount)
    
    if (tx) {
      transferStatus.value = 'Transferring... Please confirm in wallet'
      await tx.wait()
      transferStatus.value = 'Successfully transferred!'
    }
    
    transferTo.value = ''
    transferAmount.value = null
    
    await loadContractData()
  } catch (e: any) {
    transferStatus.value = `Failed: ${e.message || 'Unknown error'}`
    console.error('Error transferring:', e)
  } finally {
    isTransferring.value = false
  }
}

onMounted(() => {
  loadContractData()
})

watch(() => props.address, () => {
  loadContractData()
})
</script>
