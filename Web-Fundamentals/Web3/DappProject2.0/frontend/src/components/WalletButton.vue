<template>
  <div class="flex flex-col items-center gap-4">
    <div v-if="account" class="flex flex-col items-end gap-2">
      <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <div class="flex flex-col items-start">
          <span class="text-sm font-mono text-gray-700">{{ account.slice(0, 6) }}...{{ account.slice(-4) }}</span>
          <div class="flex items-center gap-1">
            <span v-if="isBalanceLoading" class="text-[10px] text-indigo-400 animate-pulse">Loading...</span>
            <span v-else class="text-[10px] text-indigo-600 font-bold">
              {{ ethBalance !== '0' && parseFloat(ethBalance) < 0.0001 ? ethBalance.slice(0, 8) : parseFloat(ethBalance).toFixed(4) }} ETH
            </span>
            <button @click="updateWalletInfo" class="text-gray-400 hover:text-indigo-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        <button 
          @click="disconnectWallet"
          class="text-xs text-red-600 hover:text-red-800 font-semibold uppercase tracking-wider ml-2"
        >
          Disconnect
        </button>
      </div>
      
      <!-- Network Selector -->
      <div v-if="networkName" class="flex items-center gap-2">
        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
          {{ networkName }}
        </div>
        <div class="flex gap-2">
          <button 
            v-for="(net, hexId) in SUPPORTED_NETWORKS" 
            :key="hexId"
            @click="switchNetwork(hexId)"
            :class="[
              `0x${chainId?.toString(16)}` === hexId ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
              'px-2 py-1 rounded text-[10px] font-bold transition-all'
            ]"
          >
            {{ net.chainName.split(' ')[0] }}
          </button>
        </div>
      </div>
    </div>
    <button
      v-else
      @click="connectWallet"
      class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-md text-sm"
    >
      Connect Wallet
    </button>
  </div>
</template>

<script setup lang="ts">
import { useWallet } from '@/hooks/useWallet'

const { 
  account, 
  connectWallet, 
  disconnectWallet, 
  networkName, 
  chainId, 
  switchNetwork, 
  SUPPORTED_NETWORKS, 
  ethBalance, 
  isBalanceLoading, 
  updateWalletInfo 
} = useWallet()
</script>
