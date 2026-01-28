import { useState } from 'react'
import { Address, isAddress } from 'viem'
import { isPositiveNumberString, truncateAddress } from '../../utils/format'
import Card from '../../components/UI/Card'
import { inputClass, btnPrimary } from '../../utils/ui'
import { useTokenApproval } from '../../hooks/useTokenApproval'
import { useNotify } from '../../components/UI/Notifications'
import { useEffect } from 'react'

export default function ApproveForm() {
  const [token, setToken] = useState('' as Address | '')
  const [spender, setSpender] = useState('' as Address | '')
  const [amount, setAmount] = useState('')
  const { approve, decimals, isPending, isTokenValid, isSpenderValid, isAmountValid, isDisabled, txHash, isConfirming, isConfirmed, error, waitError } = useTokenApproval({ token, spender, amount })
  const notify = useNotify()

  useEffect(() => {
    if (txHash) notify(`批准交易已提交：${truncateAddress(txHash)}`, 'info')
  }, [txHash, notify])

  useEffect(() => {
    if (isConfirming) notify('批准交易链上确认中…', 'warning')
  }, [isConfirming, notify])

  useEffect(() => {
    if (isConfirmed) notify('批准成功', 'success')
  }, [isConfirmed, notify])

  useEffect(() => {
    if (error) notify(`发送失败：${String(error?.message || error)}`, 'error')
  }, [error, notify])

  useEffect(() => {
    if (waitError) notify(`确认失败：${String(waitError?.message || waitError)}`, 'error')
  }, [waitError, notify])

  return (
    <Card title="批准（approve）">
      <div className="space-y-2">
        <input className={inputClass} placeholder="Token 合约地址" value={token} onChange={(e) => setToken(e.target.value as Address)} />
        <input className={inputClass} placeholder="Spender 地址" value={spender} onChange={(e) => setSpender(e.target.value as Address)} />
        <input className={inputClass} placeholder="批准数量 (按 token 小数位)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        {!isTokenValid && token && <div className="text-xs text-red-400">Token 地址不合法</div>}
        {!isSpenderValid && spender && <div className="text-xs text-red-400">Spender 地址不合法</div>}
        {!isAmountValid && <div className="text-xs text-red-400">请输入正数金额</div>}
        <div className="text-xs text-gray-400">decimals: {(decimals.data as number | undefined) ?? '—'}</div>
        <button disabled={isDisabled} onClick={approve} className={btnPrimary}>{isPending ? '发送中…' : '发送批准'}</button>
        <div className="text-xs text-gray-400">说明：批准用于授予 Spender 使用 transferFrom 从你的账户划转 ERC-20 的额度；你自己直接发起的 transfer 不需要批准。</div>
        {/* 状态反馈改为顶部全局通知，局部提示移除 */}
      </div>
    </Card>
  )
}