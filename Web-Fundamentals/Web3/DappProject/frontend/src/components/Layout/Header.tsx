import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { getSupportedChains } from '../../lib/wagmi'
import { truncateAddress } from '../../utils/format'

export default function Header() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const currentChain = getSupportedChains().find((c) => c.id === chainId)
  return (
    <header className="border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">DApp Project</h1>
        <div className="flex items-center gap-3">
          {currentChain && (
            <span className="px-2 py-1 rounded bg-gray-800 text-xs">{currentChain.name}</span>
          )}
          {isConnected && (
            <span className="text-xs text-gray-400">{truncateAddress(address)}</span>
          )}
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}