import React from 'react';
import { Wallet } from 'lucide-react';
import './ConnectWalletPrompt.css';

/**
 * ConnectWalletPrompt Component
 * A consistent, styled prompt for connecting wallet across all pages
 */
const ConnectWalletPrompt = ({ onConnect, title, subtitle }) => {
  return (
    <div className="connect-wallet-prompt">
      <div className="connect-wallet-icon">
        <Wallet size={48} />
      </div>
      <h2>{title || 'Connect Your Wallet'}</h2>
      <p>{subtitle || 'Please connect your Lace wallet to access this feature'}</p>
      <button className="connect-wallet-btn" onClick={onConnect}>
        <Wallet size={20} />
        <span>Connect Wallet</span>
      </button>
      <div className="connect-info">
        <div className="info-item">
          <span className="info-icon">🔒</span>
          <span>Secure connection via Midnight Network</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🌙</span>
          <span>Privacy-preserving with zero-knowledge proofs</span>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletPrompt;
