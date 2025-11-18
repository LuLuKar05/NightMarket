import { useState, useCallback } from 'react';

export const useMidnightWallet = () => {
  const [walletState, setWalletState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const wallet = window.midnight?.mnLace;
      if (!wallet) {
        throw new Error('Please install Lace Beta Wallet for Midnight Network');
      }

      // Enable wallet and get API
      const walletAPI = await wallet.enable();
      
      // Get wallet state
      const state = await walletAPI.state();
      
      // Get service URIs
      const uris = await wallet.serviceUriConfig();
      
      setWalletState({ state, uris, walletAPI });
      setIsConnected(true);
    } catch (err) {
      setError(err.message);
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
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    connectWallet,
    disconnectWallet,
    walletState,
    isConnected,
    isLoading,
    error
  };
};
