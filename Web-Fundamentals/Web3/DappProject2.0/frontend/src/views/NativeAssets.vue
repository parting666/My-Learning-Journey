<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';

const { account, signer, ethBalance, isBalanceLoading, networkName, lastError, updateWalletInfo } = useWallet();

// Native Asset State
const nativeRecipient = ref('');
const nativeAmount = ref('');
const nativeLoading = ref(false);

// Native Actions
const sendNative = async () => {
  if (!signer.value || !nativeRecipient.value || !nativeAmount.value) return;
  nativeLoading.value = true;
  try {
    const tx = await signer.value.sendTransaction({
      to: nativeRecipient.value,
      value: ethers.parseEther(nativeAmount.value)
    });
    await tx.wait();
    alert('Transfer Successful!');
    nativeRecipient.value = '';
    nativeAmount.value = '';
    await updateWalletInfo();
  } catch (error: any) {
    console.error("Native transfer error:", error);
    alert(error.message || 'Transfer Failed');
  } finally {
    nativeLoading.value = false;
  }
};

watch(account, (newAcc) => {
  if (newAcc) {
    updateWalletInfo();
  }
});

watch(ethBalance, (newBal) => {
  console.log('NativeAssets: ethBalance changed to:', newBal);
});

onMounted(() => {
  console.log('NativeAssets mounted, current account:', account.value);
  console.log('NativeAssets mounted, current ethBalance:', ethBalance.value);
  if (account.value) {
    updateWalletInfo();
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div v-if="!account" class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8 text-yellow-800 text-center font-medium">
      Please connect your wallet on the <RouterLink to="/" class="underline font-bold">Home Page</RouterLink> first.
    </div>

    <div v-if="lastError" class="bg-red-50 border border-red-200 p-4 rounded-lg mb-8 text-red-800 text-center font-medium flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ lastError }}
      <button @click="updateWalletInfo" class="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs transition-colors">Retry</button>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Native Assets</h1>

    <!-- Native Asset Section -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">ETH / MATIC Balance</h2>
          <p class="text-xs text-indigo-500 font-bold uppercase tracking-wider">{{ networkName || 'Unknown Network' }}</p>
        </div>
        <div class="text-right flex flex-col items-end">
          <p class="text-sm text-gray-500">Your Balance</p>
          <div class="flex items-center gap-2">
            <div v-if="isBalanceLoading" class="text-right">
              <p class="text-2xl font-black text-indigo-400 animate-pulse">Loading...</p>
            </div>
            <div v-else class="text-right">
              <p class="text-2xl font-black text-indigo-600">{{ ethBalance }}</p>
            </div>
            <button @click="updateWalletInfo" class="p-1 text-gray-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p class="text-[10px] text-gray-400 font-mono">{{ account }}</p>
        </div>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
          <input 
            v-model="nativeRecipient" 
            type="text" 
            placeholder="0x..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input 
            v-model="nativeAmount" 
            type="number" 
            placeholder="0.01" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        
        <button 
          @click="sendNative" 
          :disabled="!account || nativeLoading"
          class="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
        >
          {{ nativeLoading ? 'Sending...' : 'Send Native Asset' }}
        </button>
      </div>
    </section>
  </div>
</template>
