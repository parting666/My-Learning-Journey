import WalletConnect from './components/WalletConnect';
import StakingInterface from './components/StakingInterface';

function App() {
  return (
    <div className="container">
      {/* Header */}
      <header className="text-center" style={{ padding: 'var(--spacing-xl) 0' }}>
        <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>
          🚀 Staking DApp
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Stake your tokens and earn rewards automatically
        </p>
      </header>

      {/* Main Content */}
      <main>
        <WalletConnect />
        <div className="fade-in" style={{ marginTop: 'var(--spacing-lg)' }}>
          <StakingInterface />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center" style={{ padding: 'var(--spacing-xl) 0', marginTop: 'var(--spacing-xl)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Built with ❤️ using Hardhat, React, and Wagmi
        </p>
      </footer>
    </div>
  );
}

export default App;
