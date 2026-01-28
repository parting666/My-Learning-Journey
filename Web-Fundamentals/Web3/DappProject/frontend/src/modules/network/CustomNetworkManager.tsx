import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/UI/Card'
import { inputClass, btnPrimary, btnSecondary, badgeClass } from '../../utils/ui'
import type { Address } from 'viem'

type StoredCustomChain = {
  id: number
  name: string
  rpcUrl: string
  nativeSymbol?: string
  nativeDecimals?: number
  blockExplorerUrl?: string
}

const STORAGE_KEY = 'custom_chains'

export default function CustomNetworkManager() {
  const [items, setItems] = useState<StoredCustomChain[]>([])
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [rpcUrl, setRpcUrl] = useState('')
  const [symbol, setSymbol] = useState('ETH')
  const [decimals, setDecimals] = useState('18')
  const [explorer, setExplorer] = useState('')
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setItems(raw ? JSON.parse(raw) : [])
    } catch {
      setItems([])
    }
  }, [])

  const canSave = useMemo(() => {
    const idNum = Number(id)
    return (
      Number.isInteger(idNum) && idNum > 0 &&
      Boolean(rpcUrl && rpcUrl.startsWith('http')) &&
      Boolean(name)
    )
  }, [id, name, rpcUrl])

  const onSave = () => {
    if (!canSave) return
    const next: StoredCustomChain = {
      id: Number(id),
      name: name.trim(),
      rpcUrl: rpcUrl.trim(),
      nativeSymbol: (symbol || 'ETH').trim(),
      nativeDecimals: Number(decimals) || 18,
      blockExplorerUrl: explorer.trim() || undefined,
    }
    const merged = [
      ...items.filter((it) => it.id !== next.id),
      next,
    ].sort((a, b) => a.id - b.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    setItems(merged)
    setSaved(`已保存 ${next.name} (chainId=${next.id})，点击下方“应用并重载”生效。`)
  }

  const onRemove = (chainId: number) => {
    const merged = items.filter((it) => it.id !== chainId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    setItems(merged)
  }

  return (
    <Card title="自定义网络" description="添加自定义链（保存后需应用并重载）" className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400">Chain ID</label>
          <input className={inputClass} placeholder="如 11155111" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400">名称</label>
          <input className={inputClass} placeholder="如 Sepolia" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-400">RPC URL</label>
          <input className={inputClass} placeholder="https://..." value={rpcUrl} onChange={(e) => setRpcUrl(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400">原生币符号</label>
          <input className={inputClass} placeholder="ETH" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400">小数位</label>
          <input className={inputClass} placeholder="18" value={decimals} onChange={(e) => setDecimals(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-400">区块浏览器（可选）</label>
          <input className={inputClass} placeholder="https://explorer.example.com" value={explorer} onChange={(e) => setExplorer(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <button disabled={!canSave} onClick={onSave} className={btnPrimary}>保存</button>
        <button onClick={() => window.location.reload()} className={btnSecondary}>应用并重载</button>
      </div>
      {saved && <div className={badgeClass}>{saved}</div>}

      {items.length > 0 && (
        <div className="pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">已保存的自定义网络</div>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between text-sm">
                <span>
                  <span className={badgeClass}>chainId={it.id}</span>
                  <span className="ml-2">{it.name}</span>
                </span>
                <button className={btnSecondary} onClick={() => onRemove(it.id)}>移除</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}