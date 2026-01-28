import { Alchemy, Network } from 'alchemy-sdk'
import { getSupportedChains } from './wagmi'

export function toAlchemyNetwork(chainId: number): Network | undefined {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET
    case 11155111:
      return Network.ETH_SEPOLIA
    case 137:
      return Network.MATIC_MAINNET
    // Polygon Amoy testnet: SDK enum may be missing in some versions
    // Return undefined here, and rely on REST fallback below
    case 42161:
      return Network.ARB_MAINNET
    case 421614:
      return Network.ARB_SEPOLIA
    case 10:
      return Network.OPT_MAINNET
    case 11155420:
      return Network.OPT_SEPOLIA
    case 8453:
      return Network.BASE_MAINNET
    case 84532:
      return Network.BASE_SEPOLIA
    default:
      return undefined
  }
}

export function createAlchemy(chainId: number): Alchemy | undefined {
  const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY as string | undefined
  const net = toAlchemyNetwork(chainId)
  if (!apiKey || !net) return undefined
  return new Alchemy({ apiKey, network: net })
}

export function isAlchemySupportedChain(chainId: number): boolean {
  return toAlchemyNetwork(chainId) != null
}

// REST fallback for networks missing in SDK enums (e.g., Polygon Amoy 80002)
export function getAlchemyRestBase(chainId: number): string | undefined {
  switch (chainId) {
    case 1:
      return 'https://eth-mainnet.g.alchemy.com'
    case 11155111:
      return 'https://eth-sepolia.g.alchemy.com'
    case 137:
      return 'https://polygon-mainnet.g.alchemy.com'
    case 80002:
      return 'https://polygon-amoy.g.alchemy.com'
    case 42161:
      return 'https://arb-mainnet.g.alchemy.com'
    case 421614:
      return 'https://arb-sepolia.g.alchemy.com'
    case 10:
      return 'https://opt-mainnet.g.alchemy.com'
    case 11155420:
      return 'https://opt-sepolia.g.alchemy.com'
    case 8453:
      return 'https://base-mainnet.g.alchemy.com'
    case 84532:
      return 'https://base-sepolia.g.alchemy.com'
    default:
      return undefined
  }
}

export function createAlchemyRest(chainId: number): { url: string } | undefined {
  const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY as string | undefined
  const base = getAlchemyRestBase(chainId)
  if (!apiKey || !base) return undefined
  return { url: `${base}/v2/${apiKey}` }
}

export function isAlchemyRestSupportedChain(chainId: number): boolean {
  return getAlchemyRestBase(chainId) != null
}

// NFT REST v3 base for networks (used when SDK JSON-RPC methods are unsupported)
export function createAlchemyNftRest(chainId: number): { url: string } | undefined {
  const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY as string | undefined
  const base = getAlchemyRestBase(chainId)
  if (!apiKey || !base) return undefined
  // Example: https://polygon-amoy.g.alchemy.com/nft/v3/<apiKey>
  return { url: `${base}/nft/v3/${apiKey}` }
}
