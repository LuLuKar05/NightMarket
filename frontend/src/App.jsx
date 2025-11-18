import { useState } from 'react'
import './App.css'
import WalletConnect from './components/WalletConnect'
import { useWallet } from './contexts/WalletContext'

function App() {
  const { isConnected, walletState } = useWallet();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌙 NightMarket</h1>
        <p className="subtitle">Privacy-Preserving Prediction Markets on Midnight</p>
        <WalletConnect />
      </header>

      <main className="app-main">
        {isConnected ? (
          <div className="connected-content">
            <h2>Welcome to NightMarket</h2>
            <p>Your wallet is connected and ready to trade.</p>
            <div className="wallet-details">
              <p><strong>Address:</strong> {walletState?.state?.address}</p>
              <p><strong>Network:</strong> Midnight Testnet</p>
            </div>
            <div className="coming-soon">
              <h3>Coming Soon:</h3>
              <ul>
                <li>Browse Prediction Markets</li>
                <li>Place Shielded Bets with ZK Proofs</li>
                <li>View Market Outcomes</li>
                <li>Claim Rewards Privately</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="connect-prompt">
            <h2>Get Started</h2>
            <p>Connect your Lace Midnight wallet to start trading on privacy-preserving prediction markets.</p>
            <div className="features">
              <div className="feature">
                <h3>🔒 Private Trading</h3>
                <p>Place bets without revealing your identity or position size</p>
              </div>
              <div className="feature">
                <h3>🛡️ ZK Proofs</h3>
                <p>Zero-knowledge proofs ensure privacy while maintaining transparency</p>
              </div>
              <div className="feature">
                <h3>🌐 Compliant</h3>
                <p>Selective disclosure for regulatory compliance when needed</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Midnight Network • Built with Compact Smart Contracts</p>
      </footer>
    </div>
  )
}

export default App
