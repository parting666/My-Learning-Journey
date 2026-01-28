import { useState, useEffect } from 'react'
import { Address, isAddress } from 'viem'
import Card from '../../components/UI/Card'
import { inputClass, btnPrimary } from '../../utils/ui'
import { useErc721 } from '../../hooks/useErc721'
import { useErc1155 } from '../../hooks/useErc1155'
import { useErc721Assets } from '../../hooks/useErc721Assets'
import { useErc1155Assets } from '../../hooks/useErc1155Assets'
import { useNotify } from '../../components/UI/Notifications'
import { truncateAddress } from '../../utils/format'
import { useAlchemyNfts } from '../../hooks/useAlchemyNfts'
import { useAccount } from 'wagmi'

export default function NftForm() {
  const { address } = useAccount()
  const [nftType, setNftType] = useState<'erc721' | 'erc1155'>('erc721')
  const [nftToken, setNftToken] = useState('' as Address | '')
  const [nftTokenId, setNftTokenId] = useState('')
  const [nftTo, setNftTo] = useState('' as Address | '')
  const [nftAmount, setNftAmount] = useState('')
  const [erc1155IdsInput, setErc1155IdsInput] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10
  const erc1155Ids = erc1155IdsInput
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      try {
        return BigInt(s)
      } catch {
        return undefined
      }
    })
    .filter((v): v is bigint => v !== undefined)

  const erc721 = useErc721({ token: nftToken, tokenId: nftTokenId, to: nftTo })
  const erc1155 = useErc1155({ token: nftToken, tokenId: nftTokenId, amount: nftAmount, to: nftTo })
  const erc721Assets = useErc721Assets(isAddress(nftToken as string) ? (nftToken as Address) : undefined)
  const erc1155Assets = useErc1155Assets(isAddress(nftToken as string) ? (nftToken as Address) : undefined, erc1155Ids)
  const notify = useNotify()
  const alchemyNfts = useAlchemyNfts()

  const prefillNft = (contract: Address, tokenId: string, tokenType?: string) => {
    setNftToken(contract)
    setNftTokenId(tokenId)
    if (tokenType && tokenType.toUpperCase().includes('1155')) {
      setNftType('erc1155')
    } else {
      setNftType('erc721')
    }
  }

  // NFT 分页：当数据变化时重置页码
  useEffect(() => {
    setPage(1)
  }, [alchemyNfts.nfts])

  const nfts = (alchemyNfts.nfts ?? [])
  const total = nfts.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageItems = nfts.slice(start, start + PAGE_SIZE)

  // ERC-721 通知
  useEffect(() => {
    if (erc721.txHash) notify(`ERC-721 交易已提交：${truncateAddress(erc721.txHash)}`, 'info')
  }, [erc721.txHash, notify])
  useEffect(() => {
    if (erc721.isConfirming) notify('ERC-721 交易链上确认中…', 'warning')
  }, [erc721.isConfirming, notify])
  useEffect(() => {
    if (erc721.isConfirmed) notify('ERC-721 转账成功', 'success')
  }, [erc721.isConfirmed, notify])
  useEffect(() => {
    if (erc721.error) notify(`发送失败：${String(erc721.error?.message || erc721.error)}`, 'error')
  }, [erc721.error, notify])
  useEffect(() => {
    if (erc721.waitError) notify(`确认失败：${String(erc721.waitError?.message || erc721.waitError)}`, 'error')
  }, [erc721.waitError, notify])

  // ERC-1155 通知
  useEffect(() => {
    if (erc1155.txHash) notify(`ERC-1155 交易已提交：${truncateAddress(erc1155.txHash)}`, 'info')
  }, [erc1155.txHash, notify])
  useEffect(() => {
    if (erc1155.isConfirming) notify('ERC-1155 交易链上确认中…', 'warning')
  }, [erc1155.isConfirming, notify])
  useEffect(() => {
    if (erc1155.isConfirmed) notify('ERC-1155 转账成功', 'success')
  }, [erc1155.isConfirmed, notify])
  useEffect(() => {
    if (erc1155.error) notify(`发送失败：${String(erc1155.error?.message || erc1155.error)}`, 'error')
  }, [erc1155.error, notify])
  useEffect(() => {
    if (erc1155.waitError) notify(`确认失败：${String(erc1155.waitError?.message || erc1155.waitError)}`, 'error')
  }, [erc1155.waitError, notify])

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium">NFT 读取与转账</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="NFT 读取与转账 (ERC-721 / ERC-1155)" className="space-y-2">
        <div className="flex gap-2 text-sm">
          <button onClick={() => setNftType('erc721')} className={`px-2 py-1 rounded ${nftType === 'erc721' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}>ERC-721</button>
          <button onClick={() => setNftType('erc1155')} className={`px-2 py-1 rounded ${nftType === 'erc1155' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}>ERC-1155</button>
        </div>
        <input className={inputClass} placeholder="NFT 合约地址" value={nftToken} onChange={(e) => setNftToken(e.target.value as Address)} />
        <input className={inputClass} placeholder="Token ID" value={nftTokenId} onChange={(e) => setNftTokenId(e.target.value)} />
        {nftType === 'erc1155' && (
          <input className={inputClass} placeholder="数量 (整数)" value={nftAmount} onChange={(e) => setNftAmount(e.target.value)} />
        )}
        {nftType === 'erc1155' && (
          <input className={inputClass} placeholder="自动读取余额的 ID 列表（逗号分隔）" value={erc1155IdsInput} onChange={(e) => setErc1155IdsInput(e.target.value)} />
        )}
        <input className={inputClass} placeholder="接收地址" value={nftTo} onChange={(e) => setNftTo(e.target.value as Address)} />
        {!isAddress(nftToken as string) && nftToken && <div className="text-xs text-red-400">NFT 合约地址不合法</div>}
        {!isAddress(nftTo as string) && nftTo && <div className="text-xs text-red-400">接收地址不合法</div>}
        {nftType === 'erc721' && (
          <div className="text-sm">
            所有者：{(erc721.owner.data as Address | undefined) ? (erc721.owner.data as Address) : '—'}
          </div>
        )}
        {nftType === 'erc1155' && (
          <div className="text-sm">我的余额：{String(erc1155.balance.data as bigint | undefined ?? '—')}</div>
        )}
        {nftType === 'erc721' && (
          <div className="text-sm space-y-1">
            <div>我的持有数：{erc721Assets.balance !== undefined ? String(erc721Assets.balance) : '—'}</div>
            <div>
              我的 Token ID：
              {erc721Assets.tokenIds && erc721Assets.tokenIds.length > 0
                ? erc721Assets.tokenIds.map((id) => String(id)).join(', ')
                : erc721Assets.balance === 0n
                ? '无'
                : '合约未支持枚举或数据未就绪'}
            </div>
          </div>
        )}
        {nftType === 'erc1155' && erc1155Assets.balances && erc1155Assets.balances.length > 0 && (
          <div className="text-sm">
            自动读取余额：
            <ul className="list-disc ml-4">
              {erc1155Assets.balances.map((b) => (
                <li key={String(b.id)}>ID {String(b.id)}：{String(b.balance)}</li>
              ))}
            </ul>
          </div>
        )}
        {nftType === 'erc721' && (
          <button disabled={erc721.isDisabled} onClick={erc721.send721} className={btnPrimary}>{erc721.isPending ? '发送中…' : '发送 ERC-721'}</button>
        )}
        {nftType === 'erc1155' && (
          <button disabled={erc1155.isDisabled} onClick={erc1155.send1155} className={btnPrimary}>{erc1155.isPending ? '发送中…' : '发送 ERC-1155'}</button>
        )}
        <div className="text-xs text-gray-400">说明：使用钱包直接调用 safeTransferFrom 进行转账，无需提前授权；若需由第三方合约主动扣划，请先设置 approve 或 setApprovalForAll。</div>
      </Card>
      <Card title="Alchemy：自动读取 NFT (721/1155)" className="space-y-2">
        <div className="text-xs text-gray-400">
          地址：{address ?? '未连接'}；APIKey：{alchemyNfts.apiKeyMissing ? '缺失' : '已配置'}；网络支持：{alchemyNfts.supported ? '是' : '否'}
        </div>
        {!alchemyNfts.enabled && (
          <div className="text-sm text-gray-400">
            {(!alchemyNfts.supported) && '当前网络暂不支持 Alchemy 自动读取。'}
            {(!alchemyNfts.apiKeyMissing && alchemyNfts.supported) && !alchemyNfts.enabled && '请连接钱包以读取资产。'}
            {(alchemyNfts.apiKeyMissing) && '缺少 Alchemy API Key：请在 .env.local 中设置 VITE_ALCHEMY_API_KEY'}
          </div>
        )}
        {alchemyNfts.enabled && alchemyNfts.isLoading && (
          <div className="text-sm text-gray-400">读取中…</div>
        )}
        {alchemyNfts.enabled && Boolean(alchemyNfts.error) && (
          <div className="text-sm text-red-400">读取失败：{String((alchemyNfts.error as Error)?.message ?? alchemyNfts.error)}</div>
        )}
        {alchemyNfts.enabled && !alchemyNfts.isLoading && !alchemyNfts.error && (
          <div className="space-y-2">
            <ul className="text-sm space-y-2">
              {pageItems.map((n) => (
                <li key={`${n.contractAddress}-${n.tokenId}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {n.imageUrl ? (
                      <img src={n.imageUrl} alt={n.title ?? `${n.collectionName ?? 'NFT'} #${n.tokenId}`} className="w-12 h-12 rounded object-cover bg-gray-800" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center text-[10px] text-gray-400">无图</div>
                    )}
                    <div>
                      <div className="font-medium">[{n.tokenType}] {n.collectionName ?? 'NFT'} #{n.tokenId}</div>
                      <div className="text-xs text-gray-400">{n.title ? `${n.title}` : ''} {n.balance ? `(x${n.balance})` : ''}</div>
                    </div>
                  </div>
                  <button className={btnPrimary} onClick={() => prefillNft(n.contractAddress as Address, n.tokenId, n.tokenType)}>填入到转账</button>
                </li>
              ))}
              {total === 0 && (
                <li className="text-gray-400">暂无持有的 NFT</li>
              )}
            </ul>
            {total > 0 && (
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>第 {currentPage}/{pageCount} 页，{total} 项</span>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >上一页</button>
                  <button
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >下一页</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
      </div>
    </div>
  )
}
