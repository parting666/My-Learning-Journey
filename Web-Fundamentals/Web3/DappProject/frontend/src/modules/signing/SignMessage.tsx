import { useState } from 'react'
import { useSignMessage, useSignTypedData, useChainId } from 'wagmi'
import Card from '../../components/UI/Card'
import { inputClass, btnPrimary } from '../../utils/ui'

export default function Signers() {
  const [message, setMessage] = useState('Hello DApp')
  const { signMessage, data: msgSig, isPending: isMsgPending } = useSignMessage()
  const chainId = useChainId()

  const typedDomain = { name: 'DApp', version: '1', chainId }
  const typedTypes = {
    Person: [{ name: 'name', type: 'string' }, { name: 'wallet', type: 'address' }],
  } as const
  const typedValue = { name: 'Alice', wallet: '0x0000000000000000000000000000000000000000' }

  const { signTypedData, data: typedSig, isPending: isTypedPending } = useSignTypedData()

  return (
    <div className="space-y-4">
      <Card title="签名 Message" className="space-y-2">
        <input className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className={btnPrimary} disabled={isMsgPending || !message} onClick={() => signMessage({ message })}>{isMsgPending ? '签名中…' : '签名'}</button>
        {msgSig && <div className="text-xs break-words text-gray-400">签名: {msgSig}</div>}
      </Card>

      <Card title="签名 Typed Data" className="space-y-2">
        <button className={btnPrimary} disabled={isTypedPending} onClick={() => signTypedData({ domain: typedDomain, types: typedTypes, primaryType: 'Person', message: { name: 'Alice', wallet: '0x0000000000000000000000000000000000000000' as `0x${string}` } })}>{isTypedPending ? '签名中…' : '签名 EIP-712'}</button>
        {typedSig && <div className="text-xs break-words text-gray-400">签名: {typedSig}</div>}
      </Card>
    </div>
  )
}