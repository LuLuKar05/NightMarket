/**
 * Example usage of witness implementations
 * This file demonstrates how to prepare private state for use with Compact contracts
 * 
 * Note: Witnesses are called automatically by the contract runtime when executing circuits.
 * This file shows how to properly structure your private state before calling contracts.
 */

import {
    createInitialPrivateState,
    generateSecretKey,
    type PrivateState,
    type MerkleAuthPath
} from './witnesses';

// ============================================================================
// Example 1: Creating a Market
// ============================================================================

export async function createMarketExample() {
    // Initialize private state
    const privateState: PrivateState = createInitialPrivateState();

    // Set up required witness data
    privateState.senderAddress = new Uint8Array(32); // Your wallet address
    privateState.kycProof = new Uint8Array(32); // Your KYC proof from verification service

    console.log('✓ Private state prepared for market creation');
    console.log('  - Sender address:', privateState.senderAddress.length, 'bytes');
    console.log('  - KYC proof:', privateState.kycProof.length, 'bytes');

    // In your actual DApp, you would now call the contract:
    // const contract = new PredictionMarketFactoryContract(predictionMarketFactoryWitnesses);
    // const marketId = await contract.create_market(privateState, ...args);
}

// ============================================================================
// Example 2: Adding a Position
// ============================================================================

export async function addPositionExample() {
    const privateState: PrivateState = createInitialPrivateState();

    // Generate a commitment for your position
    const commitment = new Uint8Array(32);
    crypto.getRandomValues(commitment);

    console.log('✓ Position commitment generated:', commitment.length, 'bytes');

    // In your actual DApp:
    // const contract = new PositionManagerContract(positionManagerWitnesses);
    // await contract.add_position(privateState, commitment);
}

// ============================================================================
// Example 3: Spending a Position
// ============================================================================

export async function spendPositionExample() {
    const privateState: PrivateState = createInitialPrivateState();

    // Set up secret key
    privateState.positionSecretKey = generateSecretKey();

    // Create a mock commitment
    const commitment = new Uint8Array(32);
    crypto.getRandomValues(commitment);

    // Set up authentication path with correct structure
    const authPath: MerkleAuthPath = {
        leaf: commitment,
        path: Array(10).fill(0).map(() => ({
            sibling: { field: BigInt(0) },
            goes_left: false
        }))
    };

    privateState.positionAuthPaths = {
        [commitment.toString()]: authPath
    };

    console.log('✓ Private state prepared for spending position');
    console.log('  - Secret key:', privateState.positionSecretKey.length, 'bytes');
    console.log('  - Auth path configured with', authPath.path.length, 'entries');

    // In your actual DApp:
    // const contract = new PositionManagerContract(positionManagerWitnesses);
    // await contract.spend_position(privateState);
}

// ============================================================================
// Example 4: Depositing to Shielded Vault
// ============================================================================

export async function depositToVaultExample() {
    const privateState: PrivateState = createInitialPrivateState();

    // Generate a commitment for your deposit
    const commitment = new Uint8Array(32);
    crypto.getRandomValues(commitment);

    console.log('✓ Deposit commitment generated:', commitment.length, 'bytes');

    // In your actual DApp:
    // const contract = new ShieldedVaultContract(shieldedVaultWitnesses);
    // await contract.deposit(privateState, commitment);
}

// ============================================================================
// Example 5: Withdrawing from Shielded Vault
// ============================================================================

export async function withdrawFromVaultExample() {
    const privateState: PrivateState = createInitialPrivateState();

    // Set up vault secret key
    privateState.vaultSecretKey = generateSecretKey();

    // Create a mock commitment
    const commitment = new Uint8Array(32);
    crypto.getRandomValues(commitment);

    // Set up authentication path with correct structure
    const authPath: MerkleAuthPath = {
        leaf: commitment,
        path: Array(10).fill(0).map(() => ({
            sibling: { field: BigInt(0) },
            goes_left: false
        }))
    };

    privateState.balanceAuthPaths = {
        [commitment.toString()]: authPath
    };

    console.log('✓ Private state prepared for withdrawal');
    console.log('  - Secret key:', privateState.vaultSecretKey.length, 'bytes');
    console.log('  - Auth path configured with', authPath.path.length, 'entries');

    // In your actual DApp:
    // const contract = new ShieldedVaultContract(shieldedVaultWitnesses);
    // await contract.withdraw(privateState);
}

// ============================================================================
// Example 6: Resolving a Market (Oracle)
// ============================================================================

export async function resolveMarketExample() {
    const privateState: PrivateState = createInitialPrivateState();

    // Set up oracle data
    privateState.oracleAddress = new Uint8Array(32); // Oracle's address
    privateState.marketId = 42; // Market ID to resolve
    privateState.marketOutcome = 1; // 1 = YES

    console.log('✓ Private state prepared for market resolution');
    console.log('  - Oracle address:', privateState.oracleAddress.length, 'bytes');
    console.log('  - Market ID:', privateState.marketId);
    console.log('  - Outcome:', privateState.marketOutcome, '(1=YES, 2=NO)');

    // In your actual DApp:
    // const contract = new ResolutionOracleContract(resolutionOracleWitnesses);
    // await contract.resolve_market(privateState);
}

// ============================================================================
// Example 7: Complete Market Creation Flow
// ============================================================================

export async function completeMarketFlowExample() {
    console.log('\n=== Complete Market Creation Flow ===\n');

    // Step 1: Initialize state
    const privateState: PrivateState = createInitialPrivateState();
    console.log('✓ Private state initialized');

    // Step 2: User connects wallet
    // In real app: const { address, wallet } = await connectMidnightWallet();
    privateState.senderAddress = new Uint8Array(32);
    console.log('✓ Wallet connected');

    // Step 3: Verify KYC
    // In real app: const kycProof = await verifyKYC(userDetails);
    privateState.kycProof = new Uint8Array(32);
    console.log('✓ KYC verified');

    // Step 4: Create market
    const marketData = {
        question: "Will BTC reach $100k in 2025?",
        description: "Resolves YES if Bitcoin reaches $100,000 USD...",
        endTime: BigInt(Date.now() + 86400000 * 30), // 30 days
        resolutionTime: BigInt(Date.now() + 86400000 * 31), // 31 days
        complianceRules: {
            allowed_jurisdictions: [],
            min_kyc_level: 1,
            max_position_size: BigInt(10000),
            requires_kyc: true
        }
    };

    console.log('✓ Market data prepared');
    console.log('  - Question:', marketData.question);
    console.log('  - Sender:', privateState.senderAddress.length, 'bytes');
    console.log('  - KYC proof:', privateState.kycProof.length, 'bytes');

    // In your actual DApp:
    // const contract = new PredictionMarketFactoryContract(predictionMarketFactoryWitnesses);
    // const marketId = await contract.create_market(
    //   privateState,
    //   marketData.question,
    //   marketData.description,
    //   marketData.endTime,
    //   marketData.resolutionTime,
    //   marketData.complianceRules
    // );

    console.log('\n✓ Flow completed successfully!\n');
}

// ============================================================================
// Run Examples (uncomment to run standalone)
// ============================================================================

/*
// To run this file standalone:
// npx ts-node witnesses.example.ts

console.log('Running witness examples...\n');

completeMarketFlowExample()
  .then(() => console.log('All examples completed!'))
  .catch(err => console.error('Error:', err));
*/
