import { ref, onMounted, markRaw } from 'vue'
import { ethers } from 'ethers'

// Shared state (Single Source of Truth)
const account = ref<string | null>(null)
const provider = ref<ethers.BrowserProvider | null>(null)
const signer = ref<ethers.JsonRpcSigner | null>(null)
const chainId = ref<bigint | null>(null)
const networkName = ref<string | null>(null)
const ethBalance = ref<string>('0')
const lastError = ref<string | null>(null)
const isBalanceLoading = ref(false)
const isInitialized = ref(false)
let updatePromise: Promise<void> | null = null

const SUPPORTED_NETWORKS = {
  '0x1': {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io/']
  },
  '0x89': {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  '0xaa36a7': {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
  },
  '0x13882': {
    chainId: '0x13882',
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/']
  },
  '0x539': {
    chainId: '0x539',
    chainName: 'Hardhat Local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrls: []
  }
}

export function useWallet() {

  async function updateWalletInfo() {
    if (!window.ethereum) {
      lastError.value = "No Ethereum wallet detected"
      return
    }

    // Prevent concurrent updates
    if (updatePromise) return updatePromise

    updatePromise = (async () => {
      try {
        lastError.value = null
        const browserProvider = markRaw(new ethers.BrowserProvider(window.ethereum))
        provider.value = browserProvider

        // Use eth_accounts to check for existing permission
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })

        if (accounts && accounts.length > 0) {
          isBalanceLoading.value = true
          const rpcSigner = markRaw(await browserProvider.getSigner())
          signer.value = rpcSigner
          const address = await rpcSigner.getAddress()
          account.value = address

          console.log('Fetching data for address:', address)

          // Fetch network and balance with individual try-catch
          try {
            const network = await browserProvider.getNetwork()
            chainId.value = network.chainId
            networkName.value = network.name === 'unknown' ? `Chain ID: ${network.chainId}` : network.name
            console.log('Network identified:', networkName.value)
          } catch (netErr) {
            console.error('Network fetch failed:', netErr)
          }

          try {
            // Force block refresh to get most recent balance
            const balance = await browserProvider.getBalance(address, 'latest')
            ethBalance.value = ethers.formatEther(balance)
            console.log('Balance fetch success:', ethBalance.value)
          } catch (balErr) {
            console.error('Balance fetch failed:', balErr)
            lastError.value = "Failed to fetch balance"
          }

        } else {
          console.log('Wallet disconnected or no accounts authorized')
          resetState()
        }
      } catch (error: any) {
        console.error('Wallet Sync Critical Error:', error)
        lastError.value = error.message || "Unknown connection error"
        resetState()
      } finally {
        isBalanceLoading.value = false
        updatePromise = null
      }
    })()

    return updatePromise
  }

  function resetState() {
    account.value = null
    signer.value = null
    chainId.value = null
    networkName.value = null
    ethBalance.value = '0'
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert('MetaMask not detected!')
      return
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await updateWalletInfo()
    } catch (error) {
      console.error('Connect failed:', error)
    }
  }

  async function switchNetwork(hexChainId: string) {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        const network = (SUPPORTED_NETWORKS as any)[hexChainId]
        if (network) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          })
        }
      }
    }
  }

  // Event handlers
  const handleAccountsChanged = async (accounts: string[]) => {
    console.log('Accounts changed event:', accounts)
    if (accounts.length === 0) {
      resetState()
    } else {
      // Direct update to avoid race conditions
      await updateWalletInfo()
    }
  }

  const handleChainChanged = (hexChainId: string) => {
    console.log('Chain changed event:', hexChainId)
    window.location.reload()
  }

  onMounted(() => {
    if (window.ethereum) {
      // Always try to update on mount
      updateWalletInfo()

      if (!isInitialized.value) {
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
        isInitialized.value = true
        console.log('Wallet listeners initialized')
      }
    }
  })

  return {
    account,
    provider,
    signer,
    chainId,
    networkName,
    ethBalance,
    lastError,
    isBalanceLoading,
    SUPPORTED_NETWORKS,
    connectWallet,
    disconnectWallet: resetState,
    updateWalletInfo,
    switchNetwork
  }
}
