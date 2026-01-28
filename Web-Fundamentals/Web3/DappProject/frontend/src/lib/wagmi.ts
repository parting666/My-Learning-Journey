import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http, type Chain } from 'viem'
import type { Config } from 'wagmi'
import {
  mainnet,
  polygon,
  polygonAmoy,
  arbitrum,
  optimism,
  base,
  sepolia,
} from 'wagmi/chains'
// RainbowKit v2 的 getDefaultConfig 已返回可直接用于 WagmiProvider 的配置

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'CHANGE_ME'

export const baseChains: readonly [Chain, ...Chain[]] = [mainnet, polygon, polygonAmoy, arbitrum, optimism, base, sepolia]

export function createWagmiConfig(extraChains: Chain[] = []): Config {
  // 确保满足 RainbowKit 对链元组的类型要求（至少一个元素）
  const chains = ([...baseChains, ...extraChains] as unknown) as [Chain, ...Chain[]]

  // 优先使用链自带的默认 RPC；如无则退回 http() 默认
  const transports = Object.fromEntries(
    chains.map((c) => {
      const url = c.rpcUrls?.default?.http?.[0]
      return [c.id, url ? http(url) : http()]
    })
  ) as Record<number, ReturnType<typeof http>>

  return getDefaultConfig({
    appName: 'PartyDApp',
    projectId,
    chains,
    transports,
    ssr: false,
  })
}

export function loadCustomChainsFromStorage(): Chain[] {
  try {
    const raw = localStorage.getItem('custom_chains')
    if (!raw) return []
    const items = JSON.parse(raw) as Array<{
      id: number
      name: string
      rpcUrl: string
      nativeSymbol?: string
      nativeDecimals?: number
      blockExplorerUrl?: string
    }>
    return items
      .filter((i) => i && typeof i.id === 'number' && i.rpcUrl)
      .map((i) => ({
        id: i.id,
        name: i.name || `Chain ${i.id}`,
        nativeCurrency: {
          name: i.nativeSymbol || 'ETH',
          symbol: i.nativeSymbol || 'ETH',
          decimals: i.nativeDecimals ?? 18,
        },
        rpcUrls: {
          default: { http: [i.rpcUrl] },
          public: { http: [i.rpcUrl] },
        },
        blockExplorers: i.blockExplorerUrl
          ? { default: { name: 'Explorer', url: i.blockExplorerUrl } }
          : undefined,
      }))
  } catch {
    return []
  }
}

export function getSupportedChains(): Chain[] {
  return [...baseChains, ...loadCustomChainsFromStorage()]
}