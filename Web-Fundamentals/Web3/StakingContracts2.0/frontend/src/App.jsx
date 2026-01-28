import WalletConnect from './components/WalletConnect';
import StakingInterface from './components/StakingInterface';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Minimalist Sticky Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo-section">
            <h1 className="logo-text">STAKING HUB</h1>
          </div>
          <WalletConnect />
        </div>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: 'var(--spacing-xl)', flex: 1 }}>
        <div className="fade-in">
          <StakingInterface />
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="container" style={{ padding: 'var(--spacing-xl) 0', borderTop: '1px solid var(--border-color)', marginTop: 'var(--spacing-xl)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 0 }}>
            Powered by Hardhat & Wagmi • Designed for Web3
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
