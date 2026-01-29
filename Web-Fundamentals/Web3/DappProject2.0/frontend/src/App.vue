<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import WalletButton from '@/components/WalletButton.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-indigo-200 shadow-lg">A</div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Dapp</span>
          </div>
          <nav class="flex gap-6 hidden md:flex">
            <RouterLink to="/" class="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">Manage</RouterLink>
            <RouterLink to="/deploy" class="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">Deploy</RouterLink>
            <RouterLink to="/native" class="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">Native Assets</RouterLink>
            <RouterLink to="/erc20" class="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">ERC20 Assets</RouterLink>
          </nav>
        </div>
        
        <WalletButton />
      </div>
    </header>
    <div class="flex-1">
      <RouterView />
    </div>
    <footer class="bg-white border-t border-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-400 text-sm">© 2025 Antigravity Token Factory. Built with Vue 3 & Ethers.js</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles can be added here */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
