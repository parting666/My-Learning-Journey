import { useState, useEffect } from 'react'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { isPositiveNumberString, truncateAddress } from '../../utils/format'
import Card from '../../components/UI/Card'
import { inputClass, btnPrimary } from '../../utils/ui'
import { useNativeTransfer } from '../../hooks/useNativeTransfer'
import { useErc20Transfer } from '../../hooks/useErc20Transfer'
import { useNotify } from '../../components/UI/Notifications'
import { useAlchemyErc20Balances } from '../../hooks/useAlchemyErc20Balances'

export default function TransferForm() {
  const { address } = useAccount()
  const [to, setTo] = useState('' as Address | '')
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState('' as Address | '')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const native = useNativeTransfer({ to, amount })
  const erc20 = useErc20Transfer({ token, to, amount })
  const notify = useNotify()

  // 原生资产通知
  useEffect(() => {
    if (native.txHash) notify(`原生资产交易已提交：${truncateAddress(native.txHash)}`, 'info')
  }, [native.txHash, notify])
  useEffect(() => {
    if (native.isConfirming) notify('原生资产交易链上确认中…', 'warning')
  }, [native.isConfirming, notify])
  useEffect(() => {
    if (native.isConfirmed) notify('原生资产转账成功', 'success')
  }, [native.isConfirmed, notify])
  useEffect(() => {
    if (native.error) notify(`发送失败：${String(native.error?.message || native.error)}`, 'error')
  }, [native.error, notify])
  useEffect(() => {
    if (native.waitError) notify(`确认失败：${String(native.waitError?.message || native.waitError)}`, 'error')
  }, [native.waitError, notify])

  // ERC-20 通知
  useEffect(() => {
    if (erc20.txHash) notify(`ERC-20 交易已提交：${truncateAddress(erc20.txHash)}`, 'info')
  }, [erc20.txHash, notify])
  useEffect(() => {
    if (erc20.isConfirming) notify('ERC-20 交易链上确认中…', 'warning')
  }, [erc20.isConfirming, notify])
  useEffect(() => {
    if (erc20.isConfirmed) notify('ERC-20 转账成功', 'success')
  }, [erc20.isConfirmed, notify])
  useEffect(() => {
    if (erc20.error) notify(`发送失败：${String(erc20.error?.message || erc20.error)}`, 'error')
  }, [erc20.error, notify])
  useEffect(() => {
    if (erc20.waitError) notify(`确认失败：${String(erc20.waitError?.message || erc20.waitError)}`, 'error')
  }, [erc20.waitError, notify])


  const alchemy20 = useAlchemyErc20Balances()

  const prefillToken = (addr: Address) => {
    setToken(addr)
  }

  // 搜索与分页逻辑
  useEffect(() => {
    // 查询条件变化时重置到第一页
    setPage(1)
  }, [query])

  const tokens = (alchemy20.tokens ?? [])
  const filtered = tokens.filter((t) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    const name = (t.name ?? '').toLowerCase()
    const symbol = (t.symbol ?? '').toLowerCase()
    return name.includes(q) || symbol.includes(q)
  })
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium">发送 / 转账</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
        <Card title="原生资产转账" className="space-y-2">
          <input className={inputClass} placeholder="接收地址" value={to} onChange={(e) => setTo(e.target.value as Address)} />
          <input className={inputClass} placeholder="数量 (18 位)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {!isAddress(to as string) && <div className="text-xs text-red-400">地址不合法</div>}
          {!isPositiveNumberString(amount) && <div className="text-xs text-red-400">请输入正数金额</div>}
          <button disabled={native.isDisabled} onClick={native.sendNative} className={btnPrimary}>{native.isPending ? '发送中…' : '发送原生资产'}</button>
          {/* 状态反馈改为顶部全局通知，局部提示移除 */}
        </Card>

        <Card title="ERC-20 转账" className="space-y-2">
          <input className={inputClass} placeholder="Token 合约地址" value={token} onChange={(e) => setToken(e.target.value as Address)} />
          <input className={inputClass} placeholder="接收地址" value={to} onChange={(e) => setTo(e.target.value as Address)} />
          <input className={inputClass} placeholder="数量 (按 token 小数位)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {!isAddress(token as string) && token && <div className="text-xs text-red-400">Token 地址不合法</div>}
          {!isAddress(to as string) && <div className="text-xs text-red-400">接收地址不合法</div>}
          {!isPositiveNumberString(amount) && <div className="text-xs text-red-400">请输入正数金额</div>}
          <div className="text-xs text-gray-400">decimals: {(erc20.decimals.data as number | undefined) ?? '—'}</div>
          <button disabled={erc20.isDisabled} onClick={erc20.sendErc20} className={btnPrimary}>{erc20.isPending ? '发送中…' : '发送 ERC-20'}</button>
          <div className="text-xs text-gray-400">提示：当前使用钱包直接调用 ERC-20 的 transfer，不需要授权。若需第三方合约通过 transferFrom 划转，请先在“批准”中设置额度。</div>
          {/* 状态反馈改为顶部全局通知，局部提示移除 */}
        </Card>
        </div>
        <Card title="Alchemy：自动读取 ERC-20" className="space-y-2">
          <div className="text-xs text-gray-400">
            地址：{address ?? '未连接'}；APIKey：{alchemy20.apiKeyMissing ? '缺失' : '已配置'}；网络支持：{alchemy20.supported ? '是' : '否'}
          </div>
          {!alchemy20.enabled && (
            <div className="text-sm text-gray-400">
              {(!alchemy20.supported) && '当前网络暂不支持 Alchemy 自动读取。'}
              {(!alchemy20.apiKeyMissing && alchemy20.supported) && !alchemy20.enabled && '请连接钱包以读取资产。'}
              {(alchemy20.apiKeyMissing) && '缺少 Alchemy API Key：请在 .env.local 中设置 VITE_ALCHEMY_API_KEY'}
            </div>
          )}
          {alchemy20.enabled && alchemy20.isLoading && (
            <div className="text-sm text-gray-400">读取中…</div>
          )}
          {alchemy20.enabled && Boolean(alchemy20.error) && (
            <div className="text-sm text-red-400">读取失败：{String((alchemy20.error as Error)?.message ?? alchemy20.error)}</div>
          )}
          {alchemy20.enabled && !alchemy20.isLoading && !alchemy20.error && (
            <div className="space-y-2">
              <input
                className={inputClass}
                placeholder="搜索：按名称或符号"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ul className="text-sm space-y-2">
                {pageItems.map((t) => (
                  <li key={t.contractAddress} className="flex items-center justify-between gap-2">
                    <span>{t.symbol ?? t.name ?? 'Token'}：{t.balance ?? '—'}</span>
                    <button className={btnPrimary} onClick={() => prefillToken(t.contractAddress as Address)}>填入到转账</button>
                  </li>
                ))}
                {total === 0 && (
                  <li className="text-gray-400">暂无匹配的 ERC-20 资产</li>
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
