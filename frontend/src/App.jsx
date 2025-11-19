import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { useMidnightWallet } from './hooks/useMidnightWallet';
import MarketList from './pages/MarketList';
import MarketDetail from './pages/MarketDetail';
import Portfolio from './pages/Portfolio';
import Staking from './pages/Staking';
import Liquidity from './pages/Liquidity';
import UserVerification from './components/verification/UserVerification';

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
    try {
      await disconnectWallet();
    } catch (err) {
      console.error('Failed to disconnect wallet:', err.message);
    }
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
            <Link to="/verification" className="nav-link">Verify</Link>
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
                  {isLoading ? 'Disconnecting...' : 'Disconnect'}
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
            <Route 
              path="/markets" 
              element={
                <MarketList 
                  isConnected={isConnected}
                  walletAddress={walletState?.state?.address}
                  onConnect={handleConnect}
                />
              } 
            />
            <Route 
              path="/markets/:id" 
              element={
                <MarketDetail 
                  isConnected={isConnected}
                  walletAddress={walletState?.state?.address}
                  onConnect={handleConnect}
                />
              } 
            />
            <Route
              path="/portfolio"
              element={
                <Portfolio
                  isConnected={isConnected}
                  walletAddress={walletState?.state?.address}
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
            <Route
              path="/verification"
              element={
                <UserVerification
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">🌑 Built on Midnight Network</div>
        <h1 className="hero-title">The Global Standard for Private, Compliant Prediction Markets</h1>
        <p className="hero-description">
          Trade on politics, sports, and crypto markets with complete privacy. 
          Night Market leverages zero-knowledge proofs to shield your positions while maintaining regulatory compliance.
        </p>
        <div className="hero-actions">
          <Link to="/markets" className="cta-button primary">
            Explore Markets
          </Link>
          <Link to="/portfolio" className="cta-button secondary">
            View Portfolio
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">100%</div>
            <div className="stat-label">Private</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">ZK</div>
            <div className="stat-label">Powered</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">∞</div>
            <div className="stat-label">Markets</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <h2 className="section-title">The Privacy Gap in Prediction Markets</h2>
        <p className="section-subtitle">
          Current platforms expose your financial positions, political leanings, and net worth to the world
        </p>
        <div className="comparison-grid">
          <div className="comparison-card bad">
            <h3>❌ Traditional Markets</h3>
            <ul>
              <li>Public bet visibility</li>
              <li>Identity exposure</li>
              <li>Front-running risk</li>
              <li>Institutional hesitancy</li>
              <li>Single-chain limitation</li>
            </ul>
          </div>
          <div className="comparison-card good">
            <h3>✅ Night Market</h3>
            <ul>
              <li>Shielded positions</li>
              <li>Zero-knowledge privacy</li>
              <li>Private execution</li>
              <li>Compliance-ready</li>
              <li>Cross-chain future</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Shielded Betting</h3>
            <p>Private position management using zero-knowledge proofs. Your bets remain completely confidential.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Shielded Vault</h3>
            <p>Secure, private asset custody for betting funds with cryptographic guarantees.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏭</div>
            <h3>Market Factory</h3>
            <p>Create and manage prediction markets on any topic with permissioned system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Resolution Oracle</h3>
            <p>Decentralized outcome verification ensures fair and transparent results.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>ZK-KYC Ready</h3>
            <p>Verify compliance without revealing identity. Privacy meets regulation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Compliance Portal</h3>
            <p>Regulatory reporting without user doxxing. Built for the future.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Connect Wallet</h3>
            <p>Connect your Lace wallet to the Midnight Network for secure, private transactions.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Verify Your Identity</h3>
            <p>Verify through Zero-Knowledge KYC - prove compliance without revealing personal data.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Trade Privately</h3>
            <p>Spend on anything you want - bet on markets, provide liquidity, stake tokens, all privately.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Collect Winnings</h3>
            <p>Receive payouts privately when markets resolve. Your positions remain confidential.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-section">
        <h2 className="section-title">Why Night Market?</h2>
        <div className="value-grid">
          <div className="value-card">
            <div className="value-icon">🕵️</div>
            <h3>For Privacy Advocates</h3>
            <p>Trade anonymously without exposing your positions, wealth, or political views to the world.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🐋</div>
            <h3>For Crypto Whales</h3>
            <p>High-net-worth individuals can avoid front-running and protect their trading strategies.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🏢</div>
            <h3>For Institutions</h3>
            <p>Hedge funds and insurance companies get compliant hedging with privacy guarantees.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>For Regulated Markets</h3>
            <p>Jurisdictions requiring KYC can participate while maintaining user privacy.</p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <h2 className="section-title">Powered by Midnight</h2>
        <p className="section-subtitle">
          Built on the Midnight blockchain, the first privacy-focused Layer 1 with compliance built-in
        </p>
        <div className="tech-features">
          <div className="tech-item">
            <span className="tech-emoji">🔐</span>
            <span>Zero-Knowledge Proofs</span>
          </div>
          <div className="tech-item">
            <span className="tech-emoji">⚡</span>
            <span>Compact Smart Contracts</span>
          </div>
          <div className="tech-item">
            <span className="tech-emoji">🛡️</span>
            <span>Private State Management</span>
          </div>
          <div className="tech-item">
            <span className="tech-emoji">🔗</span>
            <span>Cardano Ecosystem</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Trade Privately?</h2>
        <p>Join the future of prediction markets where privacy meets compliance</p>
        <div className="cta-buttons">
          <Link to="/markets" className="cta-button primary large">
            Start Trading Now
          </Link>
          <Link to="/staking" className="cta-button secondary large">
            Stake & Earn
          </Link>
        </div>
      </section>
    </div>
  );
}

export default App;
