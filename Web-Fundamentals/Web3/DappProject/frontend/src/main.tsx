import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'
import App from './App'
import { WagmiProvider } from 'wagmi'
import { createWagmiConfig, loadCustomChainsFromStorage } from './lib/wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationsProvider } from './components/UI/Notifications'

const queryClient = new QueryClient()

const customChains = loadCustomChainsFromStorage()
const wagmiConfig = createWagmiConfig(customChains)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)