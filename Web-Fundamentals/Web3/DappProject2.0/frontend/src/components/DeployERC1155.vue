<script setup lang="ts">
import { ref } from 'vue';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { useLocalContracts } from '@/hooks/useLocalContracts';
import { MyERC1155Token } from '@/artifacts/MyERC1155Token';

const { account, signer } = useWallet();
const { addContract } = useLocalContracts();

const name = ref('');
const symbol = ref('');
const baseURI = ref('');
const loading = ref(false);
const deployedAddress = ref('');
const error = ref('');

const deploy = async () => {
  if (!signer.value) {
    error.value = 'Please connect your wallet first';
    return;
  }

  if (!name.value || !symbol.value) {
    error.value = 'Name and Symbol are required';
    return;
  }

  loading.value = true;
  error.value = '';
  deployedAddress.value = '';

  try {
    const factory = new ethers.ContractFactory(
      MyERC1155Token.abi,
      MyERC1155Token.bytecode,
      signer.value
    );

    const contract = await factory.deploy(name.value, symbol.value, baseURI.value);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    deployedAddress.value = address;

    addContract({
      contractAddress: address,
      name: name.value,
      symbol: symbol.value,
      tokenType: 'ERC1155',
      timestamp: Date.now()
    });
  } catch (err: any) {
    console.error(err);
    error.value = err.message || 'Deployment failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Deploy ERC1155 Multi-Token</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="My Multi-Token Collection"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
        <input
          v-model="symbol"
          type="text"
          placeholder="MTC"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Base URI (Optional)</label>
        <input
          v-model="baseURI"
          type="text"
          placeholder="https://api.example.com/metadata/{id}.json"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <button
        @click="deploy"
        :disabled="loading || !account"
        class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
        {{ loading ? 'Deploying...' : 'Deploy ERC1155 Contract' }}
      </button>

      <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
        {{ error }}
      </div>

      <div v-if="deployedAddress" class="p-4 bg-green-50 text-green-800 rounded-lg border border-green-100 break-all">
        <p class="font-semibold mb-1">Success! Deployed at:</p>
        <code class="text-sm bg-white px-2 py-1 rounded border border-green-200">{{ deployedAddress }}</code>
      </div>
    </div>
  </div>
</template>
