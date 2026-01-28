import { getSupportedChains } from '../../lib/wagmi'
import { useSwitchChain } from 'wagmi'
import Card from '../../components/UI/Card'
import { btnSecondary } from '../../utils/ui'

export default function ChainSwitcher() {
  const { chains, switchChain, isPending } = useSwitchChain()
  return (
    <Card title="多链切换">
      <div className="flex flex-wrap gap-2">
        {(chains.length ? chains : getSupportedChains()).map((c) => (
          <button
            key={c.id}
            onClick={() => switchChain({ chainId: c.id })}
            className={`${btnSecondary} text-sm`}
            disabled={isPending}
          >
            {c.name}
          </button>
        ))}
      </div>
    </Card>
  )
}