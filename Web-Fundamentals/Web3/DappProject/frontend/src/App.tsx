import Header from './components/Layout/Header'
import AssetList from './modules/assets/AssetList'
import TransferForm from './modules/transfers/TransferForm'
import ApproveForm from './modules/approvals/ApproveForm'
import Signers from './modules/signing/SignMessage'
import NftForm from './modules/nft/NftForm'
import ChainSwitcher from './modules/network/ChainSwitcher'
import CustomNetworkManager from './modules/network/CustomNetworkManager'
import { DeployContract } from './modules/deploy/DeployContract'
import { useState } from 'react'

type Tab = 'assets' | 'transfer' | 'approve' | 'sign' | 'network' | 'nft' | 'deploy'

export default function App() {
  const [tab, setTab] = useState<Tab>('assets')
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 space-y-6 max-w-4xl mx-auto">
        <nav className="flex gap-2">
          {[
            ['assets', '资产'],
            ['transfer', '转账'],
            ['approve', '批准'],
            ['nft', 'NFT'],
            ['sign', '签名'],
            ['network', '多链'],
            ['deploy', '部署'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as Tab)}
              className={`px-3 py-1 rounded text-sm ${tab === key ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'} transition-colors`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === 'assets' && <AssetList />}
        {tab === 'transfer' && <TransferForm />}
        {tab === 'approve' && <ApproveForm />}
        {tab === 'nft' && <NftForm />}
        {tab === 'sign' && <Signers />}
        {tab === 'network' && (
          <div className="space-y-4">
            <ChainSwitcher />
            <CustomNetworkManager />
          </div>
        )}
        {tab === 'deploy' && <DeployContract />}
      </main>
    </div>
  )
}