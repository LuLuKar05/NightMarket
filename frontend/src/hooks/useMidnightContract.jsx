import { useState, useCallback } from 'react';
import { MidnightSetupAPI } from '@meshsdk/midnight-setup';
import { setupProviders } from '../lib/setupProviders';

/**
 * Custom hook for managing Midnight smart contract interactions
 * Based on official MeshJS Midnight documentation
 * @see https://meshjs.dev/midnight/midnight-setup/examples
 */
export const useMidnightContract = () => {
  const [api, setApi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Deploy a new contract instance
   * @param {ContractInstance} contractInstance - Compiled Compact contract instance
   * @returns {Promise<MidnightSetupAPI>} Contract API instance
   */
  const deployContract = useCallback(async (contractInstance) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Setting up providers for contract deployment...');
      const providers = await setupProviders();

      console.log('🔄 Deploying contract...');
      const newApi = await MidnightSetupAPI.deployContract(
        providers,
        contractInstance
      );

      setApi(newApi);
      console.log('✅ Contract deployed at:', newApi.deployedContractAddress);

      return newApi;
    } catch (err) {
      const errorMessage = err.message || 'Failed to deploy contract';
      setError(errorMessage);
      console.error('❌ Contract deployment failed:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Join an existing deployed contract
   * @param {ContractInstance} contractInstance - Compiled Compact contract instance
   * @param {string} contractAddress - Address of deployed contract
   * @returns {Promise<MidnightSetupAPI>} Contract API instance
   */
  const joinContract = useCallback(async (contractInstance, contractAddress) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Setting up providers for joining contract...');
      const providers = await setupProviders();

      console.log('🔄 Joining contract:', contractAddress);
      const newApi = await MidnightSetupAPI.joinContract(
        providers,
        contractInstance,
        contractAddress
      );

      setApi(newApi);
      console.log('✅ Joined contract:', contractAddress);

      return newApi;
    } catch (err) {
      const errorMessage = err.message || 'Failed to join contract';
      setError(errorMessage);
      console.error('❌ Failed to join contract:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get current contract state
   * @returns {Promise<ContractStateData>} Contract state
   */
  const getContractState = useCallback(async () => {
    if (!api) {
      throw new Error('No contract API available. Deploy or join a contract first.');
    }

    try {
      const state = await api.getContractState();
      console.log('✅ Contract state retrieved:', state);
      return state;
    } catch (err) {
      console.error('❌ Failed to get contract state:', err);
      throw err;
    }
  }, [api]);

  /**
   * Get current ledger state
   * @returns {Promise<LedgerStateData>} Ledger state
   */
  const getLedgerState = useCallback(async () => {
    if (!api) {
      throw new Error('No contract API available. Deploy or join a contract first.');
    }

    try {
      const state = await api.getLedgerState();
      console.log('✅ Ledger state retrieved:', state);
      return state;
    } catch (err) {
      console.error('❌ Failed to get ledger state:', err);
      throw err;
    }
  }, [api]);

  return {
    api,
    deployContract,
    joinContract,
    getContractState,
    getLedgerState,
    isLoading,
    error,
  };
};
