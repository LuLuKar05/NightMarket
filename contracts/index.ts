/**
 * NightMarket Contracts - Main Entry Point
 * 
 * This file provides easy access to all NightMarket contracts and their witnesses.
 * Import from this file to use contracts in your DApp.
 * 
 * @example
 * ```typescript
 * import { 
 *   predictionMarketFactoryContract,
 *   positionManagerContract,
 *   PrivateState 
 * } from '@nightmarket/contracts';
 * 
 * // Use the contract
 * const result = await predictionMarketFactoryContract.circuits.create_market(
 *   context,
 *   question,
 *   description,
 *   endTime,
 *   resolutionTime,
 *   complianceRules
 * );
 * ```
 */

import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

// ============================================================================
// Import Generated Contracts
// ============================================================================

import { Contract as ZKKYCVerifierContract } from './src/managed/ZKKYCVerifier/contract/index.cjs';
import { Contract as CompliancePortalContract } from './src/managed/CompliancePortal/contract/index.cjs';
import { Contract as PositionManagerContract } from './src/managed/PositionManager/contract/index.cjs';
import { Contract as PredictionMarketFactoryContract } from './src/managed/PredictionMarketFactory/contract/index.cjs';
import { Contract as ShieldedVaultContract } from './src/managed/ShieldedVault/contract/index.cjs';
import { Contract as ResolutionOracleContract } from './src/managed/ResolutionOracle/contract/index.cjs';

// ============================================================================
// Import Witnesses
// ============================================================================

import {
    zkKYCVerifierWitnesses,
    compliancePortalWitnesses,
    positionManagerWitnesses,
    predictionMarketFactoryWitnesses,
    shieldedVaultWitnesses,
    resolutionOracleWitnesses,
    type PrivateState,
    type MerkleAuthPath,
    createInitialPrivateState,
    generateSecretKey
} from './witnesses';

// ============================================================================
// Create Contract Instances
// ============================================================================

/**
 * ZK-KYC Verifier Contract Instance
 * Handles zero-knowledge KYC verification
 */
export const zkKYCVerifierContract = new ZKKYCVerifierContract(zkKYCVerifierWitnesses);

/**
 * Compliance Portal Contract Instance
 * Manages regulatory compliance verification
 */
export const compliancePortalContract = new CompliancePortalContract(compliancePortalWitnesses);

/**
 * Position Manager Contract Instance
 * Handles private position management with Merkle tree commitments
 */
export const positionManagerContract = new PositionManagerContract(positionManagerWitnesses);

/**
 * Prediction Market Factory Contract Instance
 * Creates and manages prediction markets
 */
export const predictionMarketFactoryContract = new PredictionMarketFactoryContract(predictionMarketFactoryWitnesses);

/**
 * Shielded Vault Contract Instance
 * Provides private balance management
 */
export const shieldedVaultContract = new ShieldedVaultContract(shieldedVaultWitnesses);

/**
 * Resolution Oracle Contract Instance
 * Resolves market outcomes
 */
export const resolutionOracleContract = new ResolutionOracleContract(resolutionOracleWitnesses);

// ============================================================================
// Re-export Contract Types
// ============================================================================

// ZKKYCVerifier
export type {
    Witnesses as ZKKYCVerifierWitnesses,
    ImpureCircuits as ZKKYCVerifierCircuits,
    Ledger as ZKKYCVerifierLedger,
    ContractReferenceLocations as ZKKYCVerifierContractReferenceLocations
} from './src/managed/ZKKYCVerifier/contract/index.cjs';

// CompliancePortal
export type {
    Witnesses as CompliancePortalWitnesses,
    ImpureCircuits as CompliancePortalCircuits,
    Ledger as CompliancePortalLedger,
    ContractReferenceLocations as CompliancePortalContractReferenceLocations
} from './src/managed/CompliancePortal/contract/index.cjs';

// PositionManager
export type {
    Witnesses as PositionManagerWitnesses,
    ImpureCircuits as PositionManagerCircuits,
    Ledger as PositionManagerLedger,
    ContractReferenceLocations as PositionManagerContractReferenceLocations
} from './src/managed/PositionManager/contract/index.cjs';

// PredictionMarketFactory
export type {
    Witnesses as PredictionMarketFactoryWitnesses,
    ImpureCircuits as PredictionMarketFactoryCircuits,
    Ledger as PredictionMarketFactoryLedger,
    ContractReferenceLocations as PredictionMarketFactoryContractReferenceLocations
} from './src/managed/PredictionMarketFactory/contract/index.cjs';

// ShieldedVault
export type {
    Witnesses as ShieldedVaultWitnesses,
    ImpureCircuits as ShieldedVaultCircuits,
    Ledger as ShieldedVaultLedger,
    ContractReferenceLocations as ShieldedVaultContractReferenceLocations
} from './src/managed/ShieldedVault/contract/index.cjs';

// ResolutionOracle
export type {
    Witnesses as ResolutionOracleWitnesses,
    ImpureCircuits as ResolutionOracleCircuits,
    Ledger as ResolutionOracleLedger,
    ContractReferenceLocations as ResolutionOracleContractReferenceLocations
} from './src/managed/ResolutionOracle/contract/index.cjs';

// ============================================================================
// Re-export Witness Implementations and Types
// ============================================================================

export {
    // Witness implementations
    zkKYCVerifierWitnesses,
    compliancePortalWitnesses,
    positionManagerWitnesses,
    predictionMarketFactoryWitnesses,
    shieldedVaultWitnesses,
    resolutionOracleWitnesses,

    // Types
    type PrivateState,
    type MerkleAuthPath,
    type WitnessContext,

    // Helper functions
    createInitialPrivateState,
    generateSecretKey
};

// ============================================================================
// Re-export Contract Classes (for advanced use cases)
// ============================================================================

export {
    ZKKYCVerifierContract,
    CompliancePortalContract,
    PositionManagerContract,
    PredictionMarketFactoryContract,
    ShieldedVaultContract,
    ResolutionOracleContract
};

// ============================================================================
// Convenience Object with All Contracts
// ============================================================================

/**
 * Object containing all contract instances for easy access
 */
export const contracts = {
    zkKYCVerifier: zkKYCVerifierContract,
    compliancePortal: compliancePortalContract,
    positionManager: positionManagerContract,
    predictionMarketFactory: predictionMarketFactoryContract,
    shieldedVault: shieldedVaultContract,
    resolutionOracle: resolutionOracleContract
} as const;

/**
 * Object containing all witness implementations
 */
export const allWitnesses = {
    zkKYCVerifier: zkKYCVerifierWitnesses,
    compliancePortal: compliancePortalWitnesses,
    positionManager: positionManagerWitnesses,
    predictionMarketFactory: predictionMarketFactoryWitnesses,
    shieldedVault: shieldedVaultWitnesses,
    resolutionOracle: resolutionOracleWitnesses
} as const;

// ============================================================================
// Default Export
// ============================================================================

/**
 * Default export containing contracts and utilities
 */
export default {
    contracts,
    witnesses: allWitnesses,
    utils: {
        createInitialPrivateState,
        generateSecretKey
    }
};
