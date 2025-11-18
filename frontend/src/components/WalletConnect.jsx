import React from 'react';
import { useWallet } from '../contexts/WalletContext';

/**
 * Wallet connection component
 * Displays connection status and provides connect/disconnect actions
 */
export const WalletConnect = () => {
  const {
    connectWallet,
    disconnectWallet,
    walletState,
    isConnected,
    isLoading,
    error,
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      // Error is already handled in the hook
      console.error('Connection attempt failed');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (err) {
      console.error('Disconnection attempt failed');
    }
  };

  // Format address for display (show first 6 and last 4 chars)
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {isConnected ? (
        <div className="wallet-connected">
          <div className="wallet-info">
            <span className="status-indicator" style={{ color: '#10b981' }}>
              ● Connected
            </span>
            <span className="wallet-address" title={walletState?.state?.address}>
              {formatAddress(walletState?.state?.address)}
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="disconnect-button"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="connect-button"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
