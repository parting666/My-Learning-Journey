import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function WalletConnect() {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <div className="stat-label">Connected Wallet</div>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace'
                        }}>
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </div>
                    </div>
                    <button onClick={() => disconnect()} className="btn btn-secondary">
                        Disconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card text-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Connect Your Wallet</h3>
            <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-muted)' }}>
                Connect your wallet to start staking and earning rewards
            </p>
            <div className="flex flex-col gap-md" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {connectors.map((connector) => (
                    <button
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        className="btn btn-primary"
                    >
                        Connect {connector.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
