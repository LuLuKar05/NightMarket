import React, { createContext, useContext, useEffect } from 'react';
import { useMidnightWallet } from '../hooks/useMidnightWallet';

const WalletContext = createContext(null);

/**
 * Wallet context provider that makes wallet state available throughout the app
 */
export const WalletProvider = ({ children }) => {
  const wallet = useMidnightWallet();

  // Check if wallet was previously connected on mount
  useEffect(() => {
    wallet.checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

/**
 * Hook to access wallet context
 * @throws {Error} If used outside WalletProvider
 */
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
