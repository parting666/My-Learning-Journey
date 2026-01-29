<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { alchemy } from '@/utils/alchemy';

const { account, signer } = useWallet();

// Native Asset State
const nativeBalance = ref('0');
const nativeRecipient = ref('');
const nativeAmount = ref('');
const nativeLoading = ref(false);

// ERC20 Asset State
const erc20Tokens = ref<any[]>([]);
const selectedToken = ref<any>(null);
const erc20Recipient = ref('');
const erc20Amount = ref('');
const erc20Loading = ref(false);
const scanning = ref(false);

// Helpers
const formatBalance = (bal: string, decimals: number = 18) => {
  return parseFloat(ethers.formatUnits(bal, decimals)).toFixed(4);
};

// Native Actions
const fetchNativeBalance = async () => {
  if (!account.value || !signer.value) return;
  try {
    const bal = await signer.value.provider.getBalance(account.value);
    nativeBalance.value = ethers.formatEther(bal);
  } catch (error) {
    console.error("Error fetching native balance:", error);
  }
};

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
    await fetchNativeBalance();
  } catch (error: any) {
    console.error("Native transfer error:", error);
    alert(error.message || 'Transfer Failed');
  } finally {
    nativeLoading.value = false;
  }
};

// ERC20 Actions
const scanTokens = async () => {
  if (!account.value) return;
  scanning.value = true;
  try {
    const balances = await alchemy.core.getTokenBalances(account.value);
    
    // Enrich with metadata
    const detailedTokens = await Promise.all(
      balances.tokenBalances
        .filter((token) => token.tokenBalance && token.tokenBalance !== '0x0') // Filter zero balances
        .map(async (token) => {
          try {
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
            return {
              contractAddress: token.contractAddress,
              balance: token.tokenBalance, // hex string
              name: metadata.name,
              symbol: metadata.symbol,
              decimals: metadata.decimals,
              logo: metadata.logo,
            };
          } catch (e) {
            console.error("Metadata fetch error", e);
            return null;
          }
        })
    );
    
    erc20Tokens.value = detailedTokens.filter((t) => t !== null);
  } catch (error: any) {
    console.error("Scan tokens error:", error);
    alert('Failed to scan tokens. Ensure API Key is set.');
  } finally {
    scanning.value = false;
  }
};

const selectToken = (token: any) => {
  selectedToken.value = token;
};

const sendERC20 = async () => {
  if (!signer.value || !selectedToken.value || !erc20Recipient.value || !erc20Amount.value) return;
  erc20Loading.value = true;
  try {
    const abi = [
      "function transfer(address to, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ];
    const contract = new ethers.Contract(selectedToken.value.contractAddress, abi, signer.value) as any;
    const amount = ethers.parseUnits(erc20Amount.value, selectedToken.value.decimals);
    
    const tx = await contract.transfer(erc20Recipient.value, amount);
    await tx.wait();
    
    alert('Token Transfer Successful!');
    erc20Recipient.value = '';
    erc20Amount.value = '';
    // Refresh list? Or just balance? For now, user can re-scan.
  } catch (error: any) {
    console.error("ERC20 transfer error:", error);
    alert(error.message || 'Token Transfer Failed');
  } finally {
    erc20Loading.value = false;
  }
};

onMounted(() => {
  if (account.value) {
    fetchNativeBalance();
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Asset Management</h1>

    <!-- Native Asset Section -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">Native Asset (ETH/MATIC)</h2>
        <div class="text-right">
          <p class="text-sm text-gray-500">Balance</p>
          <p class="text-2xl font-black text-indigo-600">{{ parseFloat(nativeBalance).toFixed(4) }}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
          class="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors h-[42px]"
        >
          {{ nativeLoading ? 'Sending...' : 'Send Native' }}
        </button>
      </div>
    </section>

    <!-- ERC20 Asset Section -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">ERC20 Tokens</h2>
        <button 
          @click="scanTokens" 
          :disabled="scanning || !account"
          class="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <span v-if="scanning" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
          {{ scanning ? 'Scanning...' : 'Scan Assets (Alchemy)' }}
        </button>
      </div>

      <!-- Token List -->
      <div v-if="erc20Tokens.length > 0" class="mb-8 overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="py-2 px-4 font-semibold text-gray-600">Asset</th>
              <th class="py-2 px-4 font-semibold text-gray-600">Balance</th>
              <th class="py-2 px-4 font-semibold text-gray-600">Address</th>
              <th class="py-2 px-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="token in erc20Tokens" :key="token.contractAddress" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td class="py-3 px-4 flex items-center gap-2">
                <img v-if="token.logo" :src="token.logo" class="w-6 h-6 rounded-full" />
                <div v-else class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">{{ token.symbol?.[0] }}</div>
                <span class="font-medium">{{ token.symbol || 'Unknown' }}</span>
              </td>
              <td class="py-3 px-4 font-mono">{{ formatBalance(token.balance, token.decimals) }}</td>
              <td class="py-3 px-4 text-sm text-gray-500 font-mono truncate max-w-[150px]">{{ token.contractAddress }}</td>
              <td class="py-3 px-4">
                <button 
                  @click="selectToken(token)" 
                  class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Select
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!scanning" class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 mb-8">
        No tokens found or scan not initiated.
      </div>

      <!-- Transfer Form (Only visible if token selected) -->
      <div v-if="selectedToken" class="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-800">Transfer {{ selectedToken.symbol }}</h3>
          <button @click="selectedToken = null" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contract Address</label>
            <input 
              :value="selectedToken.contractAddress" 
              disabled 
              class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 font-mono"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
              <input 
                v-model="erc20Recipient" 
                type="text" 
                placeholder="0x..." 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input 
                v-model="erc20Amount" 
                type="number" 
                placeholder="0.0" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <button 
            @click="sendERC20" 
            :disabled="erc20Loading"
            class="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            {{ erc20Loading ? 'Transferring...' : 'Transfer Token' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
