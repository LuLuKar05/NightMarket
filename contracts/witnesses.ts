/**
 * Witness implementations for NightMarket Compact contracts
 * 
 * Witnesses provide private data to zero-knowledge circuits.
 * Each witness function receives a context and returns [privateState, witnessValue]
 */

import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

// Import contract-specific types
import type {
    Witnesses as ZKKYCVerifierWitnessesType,
    Ledger as ZKKYCVerifierLedger
} from './src/managed/ZKKYCVerifier/contract/index.cjs';

import type {
    Witnesses as CompliancePortalWitnessesType,
    Ledger as CompliancePortalLedger
} from './src/managed/CompliancePortal/contract/index.cjs';

import type {
    Witnesses as PositionManagerWitnessesType,
    Ledger as PositionManagerLedger
} from './src/managed/PositionManager/contract/index.cjs';

import type {
    Witnesses as PredictionMarketFactoryWitnessesType,
    Ledger as PredictionMarketFactoryLedger
} from './src/managed/PredictionMarketFactory/contract/index.cjs';

import type {
    Witnesses as ShieldedVaultWitnessesType,
    Ledger as ShieldedVaultLedger
} from './src/managed/ShieldedVault/contract/index.cjs';

import type {
    Witnesses as ResolutionOracleWitnessesType,
    Ledger as ResolutionOracleLedger
} from './src/managed/ResolutionOracle/contract/index.cjs';

// ============================================================================
// Type Definitions for Private State
// ============================================================================

/**
 * Interface defining the structure of private state
 * Your DApp should maintain this state securely client-side
 */
export interface PrivateState {
    // KYC & Compliance
    kycProof?: Uint8Array;
    complianceProof?: Uint8Array;

    // User Identity
    senderAddress?: Uint8Array;
    oracleAddress?: Uint8Array;

    // Position Manager
    positionSecretKey?: Uint8Array;
    positionAuthPaths?: Record<string, MerkleAuthPath>;

    // Shielded Vault
    vaultSecretKey?: Uint8Array;
    balanceAuthPaths?: Record<string, MerkleAuthPath>;
    transactionValue?: bigint;

    // Market Resolution
    marketId?: number;
    marketOutcome?: number; // 0=UNDECIDED, 1=YES, 2=NO
}

/**
 * Merkle tree authentication path structure
 * Matches the Compact runtime MerkleTreePath type
 */
export interface MerkleAuthPath {
    leaf: Uint8Array;
    path: {
        sibling: {
            field: bigint;
        };
        goes_left: boolean;
    }[];
}// ============================================================================
// ZKKYCVerifier Witnesses
// ============================================================================

export const zkKYCVerifierWitnesses: ZKKYCVerifierWitnessesType<PrivateState> = {
    /**
     * Provides a KYC proof as an opaque Uint8Array
     * This proof should contain the ZK proof of KYC compliance
     */
    kyc_proof: (context: WitnessContext<ZKKYCVerifierLedger, PrivateState>) => {
        const kycProof = context.privateState.kycProof || new Uint8Array(32);
        return [context.privateState, kycProof];
    }
};

// ============================================================================
// CompliancePortal Witnesses
// ============================================================================

export const compliancePortalWitnesses: CompliancePortalWitnessesType<PrivateState> = {
    /**
     * Provides a compliance proof as an opaque Uint8Array
     * This proof verifies regulatory compliance without revealing details
     */
    compliance_proof: (context: WitnessContext<CompliancePortalLedger, PrivateState>) => {
        const complianceProof = context.privateState.complianceProof || new Uint8Array(32);
        return [context.privateState, complianceProof];
    }
};

// ============================================================================
// PositionManager Witnesses
// ============================================================================

export const positionManagerWitnesses: PositionManagerWitnessesType<PrivateState> = {
    /**
     * Finds the authentication path for a given commitment in the Merkle tree
     * Used to prove position ownership without revealing which position
     */
    findAuthPath: (context: WitnessContext<PositionManagerLedger, PrivateState>, commitment: Uint8Array) => {
        // In production, this would search through the Merkle tree
        // For now, return a mock authentication path
        const authPath = context.privateState.positionAuthPaths?.[commitment.toString()] || {
            leaf: commitment,
            path: Array(10).fill(0).map(() => ({
                sibling: { field: BigInt(0) },
                goes_left: false
            }))
        };
        return [context.privateState, authPath];
    },

    /**
     * Provides the user's secret key for position operations
     * This key is used to generate commitments and nullifiers
     */
    secretKey: (context: WitnessContext<PositionManagerLedger, PrivateState>) => {
        const secretKey = context.privateState.positionSecretKey || new Uint8Array(32);
        return [context.privateState, secretKey];
    }
};

// ============================================================================
// PredictionMarketFactory Witnesses
// ============================================================================

export const predictionMarketFactoryWitnesses: PredictionMarketFactoryWitnessesType<PrivateState> = {
    /**
     * Provides the sender's address/identifier
     * Used to track market creators
     */
    sender: (context: WitnessContext<PredictionMarketFactoryLedger, PrivateState>) => {
        const senderAddress = context.privateState.senderAddress || new Uint8Array(32);
        return [context.privateState, senderAddress];
    },

    /**
     * Provides a KYC proof for market creation
     * Ensures only KYC-verified users can create markets
     */
    kyc_proof: (context: WitnessContext<PredictionMarketFactoryLedger, PrivateState>) => {
        const kycProof = context.privateState.kycProof || new Uint8Array(32);
        return [context.privateState, kycProof];
    }
};

// ============================================================================
// ShieldedVault Witnesses
// ============================================================================

export const shieldedVaultWitnesses: ShieldedVaultWitnessesType<PrivateState> = {
    /**
     * Finds the authentication path for a balance commitment
     * Used to prove balance ownership for withdrawals
     */
    findAuthPath: (context: WitnessContext<ShieldedVaultLedger, PrivateState>, commitment: Uint8Array) => {
        const authPath = context.privateState.balanceAuthPaths?.[commitment.toString()] || {
            leaf: commitment,
            path: Array(10).fill(0).map(() => ({
                sibling: { field: BigInt(0) },
                goes_left: false
            }))
        };
        return [context.privateState, authPath];
    },

    /**
     * Provides the user's secret key for vault operations
     * Used for deposits and withdrawals
     */
    secretKey: (context: WitnessContext<ShieldedVaultLedger, PrivateState>) => {
        const secretKey = context.privateState.vaultSecretKey || new Uint8Array(32);
        return [context.privateState, secretKey];
    }
};

// ============================================================================
// ResolutionOracle Witnesses
// ============================================================================

export const resolutionOracleWitnesses: ResolutionOracleWitnessesType<PrivateState> = {
    /**
     * Provides the oracle's address/identifier
     * Used to verify oracle authorization
     */
    oracle: (context: WitnessContext<ResolutionOracleLedger, PrivateState>) => {
        const oracleAddress = context.privateState.oracleAddress || new Uint8Array(32);
        return [context.privateState, oracleAddress];
    },

    /**
     * Provides the outcome of a market resolution
     * 0 = UNDECIDED, 1 = YES, 2 = NO
     */
    outcome: (context: WitnessContext<ResolutionOracleLedger, PrivateState>) => {
        const outcome = context.privateState.marketOutcome || 0;
        return [context.privateState, BigInt(outcome)];
    },

    /**
     * Provides the market ID to be resolved
     */
    market_id: (context: WitnessContext<ResolutionOracleLedger, PrivateState>) => {
        const marketId = context.privateState.marketId || 0;
        return [context.privateState, BigInt(marketId)];
    }
};

// ============================================================================
// Combined Witnesses Export
// ============================================================================

/**
 * Export all witnesses in a single object for easy import
 */
export const allWitnesses = {
    ZKKYCVerifier: zkKYCVerifierWitnesses,
    CompliancePortal: compliancePortalWitnesses,
    PositionManager: positionManagerWitnesses,
    PredictionMarketFactory: predictionMarketFactoryWitnesses,
    ShieldedVault: shieldedVaultWitnesses,
    ResolutionOracle: resolutionOracleWitnesses
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a random secret key (for development/testing)
 * In production, use secure key generation and storage
 */
export function generateSecretKey(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
}

/**
 * Create initial private state with default values
 */
export function createInitialPrivateState(): PrivateState {
    return {
        positionSecretKey: generateSecretKey(),
        vaultSecretKey: generateSecretKey(),
        positionAuthPaths: {},
        balanceAuthPaths: {},
        transactionValue: BigInt(0),
        marketId: 0,
        marketOutcome: 0
    };
}
