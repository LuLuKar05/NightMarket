import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';

/**
 * Setup all required Midnight providers for contract interaction
 * Based on official MeshJS Midnight documentation
 * @see https://meshjs.dev/midnight/midnight-setup/wallet
 * 
 * @returns {Promise<MidnightSetupContractProviders>} All configured providers
 */
export async function setupProviders() {
  const wallet = window.midnight?.mnLace;
  if (!wallet) {
    throw new Error('Please install Lace Beta Wallet for Midnight Network');
  }

  // Enable wallet and get state
  const walletAPI = await wallet.enable();
  const walletState = await walletAPI.state();
  const uris = await wallet.serviceUriConfig();

  console.log('🔄 Setting up Midnight providers...');
  console.log('Indexer URI:', uris.indexerUri);
  console.log('Prover URI:', uris.proverServerUri);

  return {
    // Manages private state storage locally
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'nightmarket-dapp-state',
    }),

    // Handles zero-knowledge proof configuration
    zkConfigProvider: new FetchZkConfigProvider(
      window.location.origin,
      fetch.bind(window)
    ),

    // Manages proof generation and verification
    proofProvider: httpClientProofProvider(uris.proverServerUri),

    // Fetches public blockchain data from indexer
    publicDataProvider: indexerPublicDataProvider(
      uris.indexerUri,
      uris.indexerWsUri
    ),

    // Integrates with Lace wallet for transactions
    walletProvider: {
      coinPublicKey: walletState.coinPublicKey,
      encryptionPublicKey: walletState.encryptionPublicKey,
      balanceTx: (tx, newCoins) => {
        return walletAPI.balanceAndProveTransaction(tx, newCoins);
      },
    },

    // Handles transaction submission to Midnight Network
    midnightProvider: {
      submitTx: (tx) => {
        return walletAPI.submitTransaction(tx);
      },
    },
  };
}
