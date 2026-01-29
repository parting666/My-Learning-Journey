<script setup lang="ts">
import { ref } from 'vue';
import DeployERC20 from '@/components/DeployERC20.vue';
import DeployERC721 from '@/components/DeployERC721.vue';
import DeployERC1155 from '@/components/DeployERC1155.vue';
import { useWallet } from '@/hooks/useWallet';

const { account, connectWallet } = useWallet();
const activeTab = ref('erc20');

const tabs = [
  { id: 'erc20', name: 'ERC20 Token' },
  { id: 'erc721', name: 'ERC721 NFT' },
  { id: 'erc1155', name: 'ERC1155 Multi-Token' }
];
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Deploy Tokens</h1>
      <p class="text-lg text-gray-600">Deploy your custom tokens on any EVM network</p>
    </div>

    <!-- Wallet Connection -->
    <div v-if="!account" class="text-center mb-8">
      <button
        @click="connectWallet"
        class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
      >
        Connect Wallet
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-8">
      <nav class="flex space-x-4 justify-center" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
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

    <!-- Content Area -->
    <div class="transition-all duration-300">
      <div v-if="activeTab === 'erc20'"><DeployERC20 /></div>
      <div v-if="activeTab === 'erc721'"><DeployERC721 /></div>
      <div v-if="activeTab === 'erc1155'"><DeployERC1155 /></div>
    </div>
  </div>
</template>
