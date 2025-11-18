import { useState, useCallback, useEffect } from 'react';

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

      // Enable wallet and get API according to DAppConnectorAPI
      const walletAPI = await wallet.enable();
      
      // Get wallet state from DAppConnectorWalletAPI
      const state = await walletAPI.state();
      
      // Get service URIs
      const uris = await wallet.serviceUriConfig();
      
      setWalletState({ state, uris, walletAPI });
      setIsConnected(true);
      
      console.log('✅ Wallet connected successfully');
    } catch (err) {
      console.error('❌ Wallet connection failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      // According to Midnight DAppConnectorAPI and DAppConnectorWalletAPI:
      // There's no explicit disconnect() method in the API specification.
      // Disconnection is handled by clearing the dApp's local state and references.
      
      console.log('🔌 Disconnecting wallet...');
      
      // Clear all wallet state and references
      setWalletState(null);
      setIsConnected(false);
      setError(null);
      
      console.log('✅ Wallet disconnected successfully');
    } catch (err) {
      console.error('❌ Error during wallet disconnection:', err);
      setError(err.message);
      // Always clear the state even if there's an error
      setWalletState(null);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Monitor wallet state changes
  // If the user disconnects from the wallet extension itself, we should detect it
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (isConnected && walletState?.walletAPI) {
        try {
          // Try to get the current state to verify connection is still valid
          const state = await walletState.walletAPI.state();
          if (!state) {
            console.log('⚠️ Wallet state lost, disconnecting...');
            disconnectWallet();
          }
        } catch (err) {
          // If we can't get state, the wallet might have been disconnected
          console.log('⚠️ Cannot reach wallet, disconnecting...');
          disconnectWallet();
        }
      }
    };

    // Check connection every 30 seconds
    const interval = setInterval(checkWalletConnection, 30000);

    return () => clearInterval(interval);
  }, [isConnected, walletState, disconnectWallet]);

  return {
    connectWallet,
    disconnectWallet,
    walletState,
    isConnected,
    isLoading,
    error
  };
};
