import { useAccount, useChainId } from 'wagmi'
import { useEffect, useMemo, useState } from 'react'
import { createAlchemy, isAlchemySupportedChain, createAlchemyRest, isAlchemyRestSupportedChain } from '../lib/alchemy'

type TokenBalance = {
  contractAddress: string
  rawBalance: string
  balance: string | undefined
  symbol?: string
  name?: string
  decimals?: number
}

export function useAlchemyErc20Balances() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(undefined)
  const [tokens, setTokens] = useState<TokenBalance[] | undefined>(undefined)

  const supportedSdk = isAlchemySupportedChain(chainId)
  const restSupported = isAlchemyRestSupportedChain(chainId)
  const supported = supportedSdk || restSupported
  const client = useMemo(() => (supportedSdk ? createAlchemy(chainId) : undefined), [supportedSdk, chainId])
  const restClient = useMemo(() => (restSupported ? createAlchemyRest(chainId) : undefined), [restSupported, chainId])
  const apiKeyMissing = !import.meta.env.VITE_ALCHEMY_API_KEY

  useEffect(() => {
    setError(undefined)
    setTokens(undefined)
    if (!address || (!client && !restClient)) return
    setLoading(true)
    ;(async () => {
      try {
        if (client) {
          const res = await client.core.getTokenBalances(address)
          const nonZero = res.tokenBalances.filter((t) => t.tokenBalance && t.tokenBalance !== '0')
          const out: TokenBalance[] = []
          const max = Math.min(nonZero.length, 50)
          for (let i = 0; i < max; i++) {
            const t = nonZero[i]
            const md = await client.core.getTokenMetadata(t.contractAddress)
            const decimals = md.decimals ?? 18
            const balance = t.tokenBalance ? (BigInt(t.tokenBalance) / BigInt(10) ** BigInt(decimals)).toString() : undefined
            out.push({ contractAddress: t.contractAddress, rawBalance: t.tokenBalance || '0', balance, symbol: md.symbol ?? undefined, name: md.name ?? undefined, decimals })
          }
          setTokens(out)
        } else if (restClient) {
          // JSON-RPC fallback for unsupported SDK networks (e.g. Polygon Amoy)
          const rpc = async (method: string, params: unknown) => {
            const r = await fetch(restClient.url, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
            })
            const j = await r.json()
            if (j.error) throw new Error(j.error?.message || 'Alchemy RPC error')
            return j.result
          }
          const res: { tokenBalances: Array<{ contractAddress: string; tokenBalance: string | null }> } = await rpc('alchemy_getTokenBalances', [address])
          const nonZero = res.tokenBalances.filter((t) => t.tokenBalance && t.tokenBalance !== '0')
          const out: TokenBalance[] = []
          const max = Math.min(nonZero.length, 50)
          for (let i = 0; i < max; i++) {
            const t = nonZero[i]
            const md: { name?: string; symbol?: string; decimals?: number } = await rpc('alchemy_getTokenMetadata', [t.contractAddress])
            const decimals = md.decimals ?? 18
            const balance = t.tokenBalance ? (BigInt(t.tokenBalance) / BigInt(10) ** BigInt(decimals)).toString() : undefined
            out.push({ contractAddress: t.contractAddress, rawBalance: t.tokenBalance || '0', balance, symbol: md.symbol ?? undefined, name: md.name ?? undefined, decimals })
          }
          setTokens(out)
        }
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [address, client, restClient])

  return {
    enabled: Boolean(address) && supported && !apiKeyMissing,
    isLoading,
    error,
    tokens,
    apiKeyMissing,
    supported,
    refetch: async () => {
      // retrigger by reassigning or call effect path; simply set address changes.
      // consumers can rely on state changes; here just a no-op for API consistency.
    },
  }
}
