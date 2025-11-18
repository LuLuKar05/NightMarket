// Global type declarations for Midnight Network
declare global {
  interface Window {
    midnight?: {
      mnLace?: {
        enable: () => Promise<{
          state: () => Promise<{
            address: string;
            coinPublicKey: string;
            encryptionPublicKey: string;
          }>;
          balanceAndProveTransaction: (tx: any, newCoins: any) => Promise<any>;
          submitTransaction: (tx: any) => Promise<any>;
        }>;
        disconnect: () => Promise<void>;
        isEnabled: () => Promise<boolean>;
        serviceUriConfig: () => Promise<{
          indexerUri: string;
          indexerWsUri: string;
          proverServerUri: string;
        }>;
      };
    };
  }
}

export {};
