import { useAccount } from 'wagmi'
import { useNativeBalance, useErc20Balance } from './useBalances'
import { useState } from 'react'
import type { Address } from 'viem'
import { isAddress } from 'viem'
import Card from '../../components/UI/Card'
import { inputClass } from '../../utils/ui'
import { useAlchemyErc20Balances } from '../../hooks/useAlchemyErc20Balances'

export default function AssetList() {
  const { address, isConnected } = useAccount()
  const native = useNativeBalance()
  const [tokenAddr, setTokenAddr] = useState('' as Address | '')
  const erc20 = useErc20Balance((tokenAddr || undefined) as Address, address)
  const isTokenValid = Boolean(tokenAddr && isAddress(tokenAddr as string))
  const balanceError = erc20.balance.error as Error | undefined
  const prettyError = balanceError?.message?.includes('returned no data ("0x")')
    ? '该地址在当前网络不是已部署的 ERC-20 合约，或函数签名不匹配。请确认网络与合约地址。'
    : balanceError?.message

  const alchemy20 = useAlchemyErc20Balances()

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium">资产获取</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="原生资产">
          {!isConnected && (
            <div className="text-sm text-gray-400">请先连接钱包</div>
          )}
          {isConnected && native.isFetching && (
            <div className="text-sm text-gray-400">读取中…</div>
          )}
          {isConnected && native.error && (
            <div className="text-sm text-red-400">读取失败：{(native.error as Error).message}</div>
          )}
          {isConnected && !native.isFetching && !native.error && (
            <div className="text-2xl font-semibold">{native.data?.formatted ?? '—'} {native.data?.symbol}</div>
          )}
        </Card>

        <Card title="ERC-20 资产" className="space-y-2">
          <input
            className={inputClass}
            placeholder="输入 token 合约地址"
            value={tokenAddr}
            onChange={(e) => setTokenAddr(e.target.value as Address)}
          />
          {tokenAddr && !isTokenValid && (
            <div className="text-xs text-red-400">不是合法的以太坊地址</div>
          )}
          {!isConnected && (
            <div className="text-sm text-gray-400">请先连接钱包</div>
          )}
          {isConnected && isTokenValid && erc20.balance.isFetching && (
            <div className="text-sm text-gray-400">读取中…</div>
          )}
          {isConnected && isTokenValid && erc20.balance.error && (
            <div className="text-sm text-red-400">读取失败：{prettyError}</div>
          )}
          <div className="text-sm">{(erc20.symbol.data as string) ?? ''}</div>
          <div className="text-2xl font-semibold">{erc20.formatted ?? '—'}</div>
        </Card>

        

        
      </div>
    </div>
  )
}
