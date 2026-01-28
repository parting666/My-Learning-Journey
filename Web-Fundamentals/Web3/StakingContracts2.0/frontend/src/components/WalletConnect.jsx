import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function WalletConnect() {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div className="flex items-center gap-md">
                <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontFamily: 'monospace',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                }}>
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                    onClick={() => disconnect()}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-sm">
            {connectors.map((connector) => (
                <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                    Connect {connector.name.split(' ')[0]}
                </button>
            ))}
        </div>
    );
}
