import { useState, useCallback } from 'react';

/**
 * Custom hook for managing Midnight Lace wallet connection
 * Based on official Midnight documentation
 * @see https://docs.midnight.network/how-to/react-wallet-connect
 */
export const useMidnightWallet = () => {
  const [walletState, setWalletState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Lace wallet is available
      const wallet = window.midnight?.mnLace;
      if (!wallet) {
        throw new Error('Please install Lace Beta Wallet for Midnight Network');
      }

      // Enable wallet and request authorization
      const walletAPI = await wallet.enable();

      // Get wallet state (address, keys, etc.)
      const state = await walletAPI.state();

      // Get service URIs (indexer, prover, etc.)
      const uris = await wallet.serviceUriConfig();

      setWalletState({ state, uris, walletAPI });
      setIsConnected(true);

      console.log('✅ Wallet connected successfully');
      console.log('Address:', state.address);
      console.log('Service URIs:', uris);

      return { state, uris, walletAPI };
    } catch (err) {
      const errorMessage = err.message || 'Failed to connect wallet';
      setError(errorMessage);
      console.error('❌ Wallet connection failed:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      const wallet = window.midnight?.mnLace;
      if (wallet) {
        await wallet.disconnect();
        setWalletState(null);
        setIsConnected(false);
        setError(null);
        console.log('✅ Wallet disconnected');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to disconnect wallet';
      setError(errorMessage);
      console.error('❌ Wallet disconnection failed:', errorMessage);
    }
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const wallet = window.midnight?.mnLace;
      if (!wallet) {
        return false;
      }

      const isEnabled = await wallet.isEnabled();
      if (isEnabled) {
        // Wallet was previously connected, restore state
        const walletAPI = await wallet.enable();
        const state = await walletAPI.state();
        const uris = await wallet.serviceUriConfig();

        setWalletState({ state, uris, walletAPI });
        setIsConnected(true);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Failed to check wallet connection:', err);
      return false;
    }
  }, []);

  return {
    connectWallet,
    disconnectWallet,
    checkConnection,
    walletState,
    isConnected,
    isLoading,
    error,
  };
};
