import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { useMidnightWallet } from './hooks/useMidnightWallet';
import MarketList from './pages/MarketList';
import MarketDetail from './pages/MarketDetail';
import Portfolio from './pages/Portfolio';
import Staking from './pages/Staking';
import Liquidity from './pages/Liquidity';

function App() {
  const {
    connectWallet,
    disconnectWallet,
    walletState,
    isConnected,
    isLoading,
    error
  } = useMidnightWallet();

  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Failed to connect wallet:', err.message);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
  };

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <Link to="/" className="app-title-link">
              <h1>NightMarket</h1>
            </Link>
          </div>
          <nav className="app-nav">
            <Link to="/markets" className="nav-link">Markets</Link>
            <Link to="/portfolio" className="nav-link">Portfolio</Link>
            <Link to="/staking" className="nav-link">Staking</Link>
            <Link to="/liquidity" className="nav-link">Liquidity</Link>
          </nav>
          <div className="wallet-connect">
            {error && (
              <div className="wallet-error">
                {error}
              </div>
            )}
            {isConnected ? (
              <div className="wallet-connected">
                <div className="wallet-info">
                  <span className="status-indicator">● Connected</span>
                  <span className="wallet-address">
                    {formatAddress(walletState?.state?.address)}
                  </span>
                </div>
                <button 
                  className="disconnect-button" 
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="connect-button" 
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/markets" element={<MarketList />} />
            <Route path="/markets/:id" element={<MarketDetail />} />
            <Route
              path="/portfolio"
              element={
                <Portfolio
                  isConnected={isConnected}
                  onConnect={handleConnect}
                />
              }
            />
            <Route
              path="/staking"
              element={
                <Staking
                  isConnected={isConnected}
                  onConnect={handleConnect}
                />
              }
            />
            <Route
              path="/liquidity"
              element={
                <Liquidity
                  isConnected={isConnected}
                  onConnect={handleConnect}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1 className="hero-title">Trade the Future, Privately</h1>
        <p className="hero-description">
          NightMarket brings prediction markets to the Midnight Network, enabling
          privacy-preserving trading with zero-knowledge proofs.
        </p>
        <div className="hero-actions">
          <Link to="/markets" className="cta-button primary">
            Explore Markets
          </Link>
          <Link to="/portfolio" className="cta-button secondary">
            View Portfolio
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">P</div>
          <h3>Private Trading</h3>
          <p>Your positions and bets remain completely private using zero-knowledge proofs</p>
        </div>
        <div className="feature">
          <div className="feature-icon">Z</div>
          <h3>Zero-Knowledge Proofs</h3>
          <p>Prove your trades without revealing sensitive information</p>
        </div>
        <div className="feature">
          <div className="feature-icon">C</div>
          <h3>Compliant</h3>
          <p>Built with ZK-KYC for regulatory compliance while maintaining privacy</p>
        </div>
      </section>
    </div>
  );
}

export default App;
