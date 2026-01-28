import { useAccount, useChainId } from 'wagmi'
import { useEffect, useMemo, useState } from 'react'
import { createAlchemy, isAlchemySupportedChain, createAlchemyNftRest, isAlchemyRestSupportedChain } from '../lib/alchemy'

type OwnedNftItem = {
  contractAddress: string
  tokenId: string
  tokenType: 'ERC721' | 'ERC1155' | string
  title?: string
  collectionName?: string
  balance?: string
  imageUrl?: string
}

export function useAlchemyNfts() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(undefined)
  const [nfts, setNfts] = useState<OwnedNftItem[] | undefined>(undefined)

  const supportedSdk = isAlchemySupportedChain(chainId)
  const supportedRest = isAlchemyRestSupportedChain(chainId)
  const supported = supportedSdk || supportedRest
  const client = useMemo(() => (supportedSdk ? createAlchemy(chainId) : undefined), [supportedSdk, chainId])
  const restClient = useMemo(() => (supportedRest ? createAlchemyNftRest(chainId) : undefined), [supportedRest, chainId])
  const apiKeyMissing = !import.meta.env.VITE_ALCHEMY_API_KEY

  const normalizeUrl = (u: unknown): string | undefined => {
    if (!u || typeof u !== 'string') return undefined
    const url = u.trim()
    if (!url) return undefined
    if (url.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`
    }
    return url
  }

  useEffect(() => {
    setError(undefined)
    setNfts(undefined)
    if (!address || (!client && !restClient)) return
    setLoading(true)
      ; (async () => {
        try {
          if (client) {
            const res = await client.nft.getNftsForOwner(address)
            const items: OwnedNftItem[] = res.ownedNfts.map((n) => ({
              contractAddress: n.contract.address,
              tokenId: n.tokenId,
              tokenType: n.tokenType as any,
              // Use metadata.name for title; some SDK types do not expose `title`
              title: (n as any).metadata && (n as any).metadata.name ? String((n as any).metadata.name) : undefined,
              collectionName: n.contract.name ?? undefined,
              balance: n.balance ?? undefined,
              imageUrl:
                normalizeUrl(((n as any).media?.[0]?.gateway as string | undefined) ?? ((n as any).media?.[0]?.raw as string | undefined)) ||
                normalizeUrl((n as any).metadata?.image as string | undefined),
            }))
            setNfts(items)
          } else if (restClient) {
            // REST v3 fallback for NFT ownership on networks like Polygon Amoy
            const url = `${restClient.url}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=50`
            const r = await fetch(url)
            const j: any = await r.json()
            if (!r.ok) throw new Error(j?.error || 'Alchemy NFT REST error')
            const items: OwnedNftItem[] = (j?.ownedNfts || []).map((n: any) => ({
              contractAddress: n?.contract?.address,
              tokenId: String(n?.tokenId ?? ''),
              tokenType: (n?.tokenType as any) ?? 'ERC721',
              title:
                (typeof n?.title === 'string' ? n.title : undefined) ??
                (typeof n?.metadata?.name === 'string' ? n.metadata.name : undefined),
              collectionName: (typeof n?.contract?.name === 'string' ? n.contract.name : undefined),
              balance: typeof n?.balance === 'string' ? n.balance : undefined,
              imageUrl:
                normalizeUrl(n?.image?.cachedUrl) ||
                normalizeUrl(n?.image?.thumbnailUrl) ||
                normalizeUrl(n?.image?.originalUrl) ||
                normalizeUrl(n?.media?.[0]?.gateway) ||
                normalizeUrl(n?.media?.[0]?.raw) ||
                normalizeUrl(n?.metadata?.image),
            }))
            setNfts(items)
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
    nfts,
    apiKeyMissing,
    supported,
    refetch: async () => { },
  }
}
