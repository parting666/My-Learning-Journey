<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ethers } from 'ethers';
import ManageERC20 from '@/components/ManageERC20.vue';
import ManageERC721 from '@/components/ManageERC721.vue';
import ManageERC1155 from '@/components/ManageERC1155.vue';
import DeploymentHistory from '@/components/DeploymentHistory.vue';
import { useWallet } from '@/hooks/useWallet';
import { useLocalContracts, type LocalDeployment } from '@/hooks/useLocalContracts';
import { alchemy } from '@/utils/alchemy';

const { account, chainId, SUPPORTED_NETWORKS, ethBalance, isBalanceLoading, lastError, updateWalletInfo } = useWallet();
const { contracts } = useLocalContracts();

const getExplorerUrl = (address: string) => {
  if (!chainId.value) return '';
  const hexChainId = `0x${chainId.value.toString(16)}`;
  const network = (SUPPORTED_NETWORKS as any)[hexChainId];
  if (network && network.blockExplorerUrls.length > 0) {
    return `${network.blockExplorerUrls[0]}address/${address}`;
  }
  return '';
};

const activeTab = ref('erc20');
const mode = ref<'manage' | 'factory' | 'assets'>('assets');
const selectedContract = ref<LocalDeployment | null>(null);
const factoryAddress = ref(localStorage.getItem('antigravity_factory_address') || '');

// Asset Overview State
const erc20Tokens = ref<any[]>([]);
const loadingAssets = ref(false);

const saveFactoryAddress = () => {
  localStorage.setItem('antigravity_factory_address', factoryAddress.value);
};

const tabs = [
  { id: 'erc20', name: 'ERC20 Token' },
  { id: 'erc721', name: 'ERC721 NFT' },
  { id: 'erc1155', name: 'ERC1155 Multi-Token' }
];

const filteredContracts = computed(() => {
  const type = activeTab.value.toUpperCase();
  return contracts.value.filter(c => c.tokenType === type);
});

const selectContract = (contract: LocalDeployment) => {
  selectedContract.value = contract;
};

const backToManageList = () => {
  selectedContract.value = null;
};

// Asset Overview Functions
const loadAssets = async () => {
  if (!account.value) return;
  loadingAssets.value = true;
  
  try {
    // Refresh global wallet info (includes balance)
    await updateWalletInfo();
    
    // Fetch ERC20 tokens via Alchemy if available
    try {
      if (alchemy) {
        const balances = await alchemy.core.getTokenBalances(account.value);
        const detailedTokens = await Promise.all(
          balances.tokenBalances
            .filter((token) => token.tokenBalance && token.tokenBalance !== '0x0')
            .slice(0, 5) // Limit to top 5 for overview
            .map(async (token) => {
              try {
                const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
                return {
                  contractAddress: token.contractAddress,
                  balance: token.tokenBalance,
                  name: metadata.name,
                  symbol: metadata.symbol,
                  decimals: metadata.decimals,
                  logo: metadata.logo,
                };
              } catch (e) {
                return null;
              }
            })
        );
        erc20Tokens.value = detailedTokens.filter((t) => t !== null);
      }
    } catch (e) {
      console.error('Failed to fetch ERC20 tokens:', e);
    }
  } catch (error) {
    console.error('Error loading assets:', error);
  } finally {
    loadingAssets.value = false;
  }
};

const formatBalance = (bal: string, decimals: number = 18) => {
  return parseFloat(ethers.formatUnits(bal, decimals)).toFixed(4);
};

// Watch for account changes to auto-load assets
watch(account, (newAccount) => {
  if (newAccount) {
    loadAssets();
  } else {
    // Clear assets when disconnected
    erc20Tokens.value = [];
  }
});

// Watch for network changes to auto-reload assets
watch(chainId, (newChainId) => {
  if (newChainId && account.value) {
    loadAssets();
  }
});

onMounted(() => {
  if (account.value) {
    loadAssets();
  }
});
</script>

<template>
  <main class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Manage Your Assets</h1>
        <p class="text-lg text-gray-600 mb-6">
          View wallet overview and manage deployed contracts
        </p>

        <!-- Error Display -->
        <div v-if="lastError" class="max-w-md mx-auto mb-4 bg-red-50 border border-red-200 p-3 rounded-lg text-red-700 text-sm flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ lastError }}
          <button @click="updateWalletInfo" class="underline font-bold ml-2">Retry</button>
        </div>

        <!-- Wallet Connection (Moved to Header) -->
        <div v-if="!account" class="text-center mt-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
          <p class="text-gray-600 mb-4">Connect your wallet to get started managing your assets.</p>
        </div>
      </div>

      <!-- Mode Toggle -->
      <div class="mb-8 flex justify-center">
        <div class="bg-gray-200 p-1 rounded-xl flex gap-1">
          <button 
            @click="mode = 'assets'; selectedContract = null"
            :class="[
              mode === 'assets' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700',
              'px-6 py-2 rounded-lg font-bold transition-all'
            ]"
          >
            Asset Overview
          </button>
          <button 
            @click="mode = 'manage'; selectedContract = null"
            :class="[
              mode === 'manage' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700',
              'px-6 py-2 rounded-lg font-bold transition-all'
            ]"
          >
            Manage Contracts
          </button>
          <button 
            @click="mode = 'factory'; selectedContract = null"
            :class="[
              mode === 'factory' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700',
              'px-6 py-2 rounded-lg font-bold transition-all'
            ]"
          >
            Factory History
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="transition-all duration-300">
        <!-- Asset Overview Mode -->
        <div v-if="mode === 'assets'" class="space-y-6">
          <div v-if="!account" class="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p class="text-gray-500">Connect your wallet to view asset overview</p>
          </div>
          
          <div v-else>
            <!-- Refresh Button -->
            <div class="flex justify-end mb-4">
              <button 
                @click="loadAssets" 
                :disabled="loadingAssets"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <span v-if="loadingAssets" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                {{ loadingAssets ? 'Loading...' : 'Refresh Assets' }}
              </button>
            </div>

            <!-- Native Balance Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-bold text-gray-800">Native Balance</h3>
                  <p class="text-sm text-gray-500">ETH / MATIC</p>
                </div>
                <div class="text-right">
                  <p v-if="isBalanceLoading" class="text-3xl font-black text-indigo-400 animate-pulse">Loading...</p>
                  <p v-else class="text-3xl font-black text-indigo-600">{{ parseFloat(ethBalance).toFixed(4) }}</p>
                </div>
              </div>
            </div>

            <!-- ERC20 Tokens Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">ERC20 Tokens (Top 5)</h3>
              
              <div v-if="erc20Tokens.length === 0" class="text-center py-8 text-gray-500">
                No ERC20 tokens found
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="token in erc20Tokens" 
                  :key="token.contractAddress"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <img v-if="token.logo" :src="token.logo" class="w-8 h-8 rounded-full" />
                    <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                      {{ token.symbol?.[0] }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ token.symbol || 'Unknown' }}</p>
                      <p class="text-xs text-gray-500 font-mono">{{ token.contractAddress.slice(0, 10) }}...</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-mono font-semibold text-gray-900">{{ formatBalance(token.balance, token.decimals) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Factory Mode -->
        <div v-else-if="mode === 'factory'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-lg font-bold mb-4 text-gray-800">Token Factory Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Factory Contract Address</label>
                <div class="flex gap-2">
                  <input
                    v-model="factoryAddress"
                    type="text"
                    placeholder="0x..."
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button 
                    @click="saveFactoryAddress"
                    class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
                <p class="mt-2 text-xs text-gray-500">
                  Enter the address of the TokenFactory contract to see global deployment history.
                </p>
              </div>
            </div>
          </div>
          <DeploymentHistory :factoryAddress="factoryAddress" />
        </div>

        <!-- Manage Mode -->
        <div v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Tab Navigation for Manage Mode -->
          <div class="mb-6">
            <nav class="flex space-x-4 justify-center" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id; selectedContract = null"
                :class="[
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700',
                  'px-4 py-2 font-medium text-sm rounded-md transition-colors'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Contract List -->
          <div v-if="!selectedContract" class="grid grid-cols-1 gap-4">
            <div v-if="filteredContracts.length === 0" class="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p class="text-gray-500">No {{ activeTab.toUpperCase() }} contracts found in your local history.</p>
              <RouterLink to="/deploy" class="mt-4 inline-block text-indigo-600 font-bold hover:underline">Deploy one now →</RouterLink>
            </div>
            <div 
              v-for="contract in filteredContracts" 
              :key="contract.contractAddress"
              @click="selectContract(contract)"
              class="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
            >
              <div class="flex items-center gap-4">
                <div :class="[
                  activeTab === 'erc20' ? 'bg-blue-100 text-blue-600' :
                  activeTab === 'erc721' ? 'bg-purple-100 text-purple-600' :
                  'bg-cyan-100 text-cyan-600',
                  'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg'
                ]">
                  {{ contract.symbol.slice(0, 2) }}
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{{ contract.name }}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-xs text-gray-400 font-mono">{{ contract.contractAddress.slice(0, 10) }}...{{ contract.contractAddress.slice(-8) }}</p>
                    <a 
                      v-if="getExplorerUrl(contract.contractAddress)"
                      :href="getExplorerUrl(contract.contractAddress)" 
                      target="_blank" 
                      class="text-[10px] text-indigo-500 hover:underline"
                      @click.stop
                    >
                      Explorer ↗
                    </a>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-1">{{ new Date(contract.timestamp).toLocaleDateString() }}</span>
                <span class="inline-flex items-center gap-1 text-indigo-600 font-bold text-sm">
                  Manage 
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Specific Management Component -->
          <div v-else>
            <div class="mb-4 flex items-center">
              <button @click="backToManageList" class="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                Back to List
              </button>
            </div>
            <div v-if="activeTab === 'erc20'"><ManageERC20 :address="selectedContract.contractAddress" /></div>
            <div v-if="activeTab === 'erc721'"><ManageERC721 :address="selectedContract.contractAddress" /></div>
            <div v-if="activeTab === 'erc1155'"><ManageERC1155 :address="selectedContract.contractAddress" /></div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Asset Overview</h3>
          <p class="text-gray-600">View all your wallet assets in one place with real-time balances.</p>
        </div>
        <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-0.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Contract Management</h3>
          <p class="text-gray-600">Easily manage your deployed contracts with mint and transfer functions.</p>
        </div>
        <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Multi-Network</h3>
          <p class="text-gray-600">Supports Ethereum, Polygon, BSC, and any other EVM-compatible networks.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-in {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromBottom {
  from { transform: translateY(1rem); }
  to { transform: translateY(0); }
}

.fade-in {
  animation-name: fadeIn;
}

.slide-in-from-bottom-4 {
  animation-name: slideInFromBottom;
}
</style>
