# 🌙 NightMarket - Wallet Integration Guide

Privacy-Preserving Prediction Markets on Midnight Network

## 🎯 Overview

NightMarket is a decentralized prediction market platform built on Midnight Network, enabling users to place shielded bets using zero-knowledge proofs. This ensures complete privacy of bet amounts and user identities while maintaining transparency through selective disclosure for compliance.

## ✅ Completed: Wallet Integration (Phase 1)

### What's Been Implemented

#### Frontend Wallet Infrastructure
- **✅ Midnight SDK Integration**: Installed all required `@midnight-ntwrk` packages and `@meshsdk/midnight-setup`
- **✅ Wallet Connection Hook** (`useMidnightWallet`): Complete Lace wallet integration with connect/disconnect functionality
- **✅ Wallet Context Provider**: Global wallet state management across the application
- **✅ Provider Setup** (`setupProviders`): Configured all Midnight providers:
  - `privateStateProvider` - Local private state storage
  - `zkConfigProvider` - Zero-knowledge proof configuration
  - `proofProvider` - Proof generation and verification
  - `publicDataProvider` - Blockchain indexer integration
  - `walletProvider` - Lace wallet transaction handling
  - `midnightProvider` - Transaction submission to Midnight Network
- **✅ Contract Interaction Hook** (`useMidnightContract`): Deploy and join Compact contracts via `MidnightSetupAPI`
- **✅ UI Components**: 
  - WalletConnect component with connection status
  - Styled landing page with feature highlights
  - Responsive design with Midnight theme

#### Backend API Infrastructure
- **✅ Environment Configuration**: `.env` setup for network, RPC URLs, and future contract addresses
- **✅ Express Server**: Enhanced with dotenv, health checks, and error handling
- **✅ Dependencies**: Installed axios for future oracle integration

### Architecture

```
Frontend (React + Vite)
├── Lace Wallet Extension (window.midnight.mnLace)
├── useMidnightWallet Hook → Connect/Disconnect
├── WalletContext → Global State
├── setupProviders() → Configure Midnight SDK
├── useMidnightContract Hook → Deploy/Join Contracts
└── WalletConnect Component → UI

Backend (Express.js)
├── .env Configuration
├── Health & Status Endpoints
└── Future: Market/Proof/Oracle Routes
```

## 🚀 Quick Start

### Prerequisites

1. **Install Lace Midnight Preview Wallet**
   - Download from [Chrome Web Store](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg)
   - Create wallet and save seed phrase securely
   - Get testnet tDUST from [Midnight Faucet](https://midnight.network/test-faucet/)

2. **Install Docker** (for local proof server - optional)
   - Download from [Docker Desktop](https://www.docker.com/products/docker-desktop/)

3. **Run Local Proof Server** (recommended for development)
   ```powershell
   docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
   ```
   - In Lace wallet: Settings → Midnight → Select "Local (http://localhost:6300)"

### Installation

1. **Clone and install dependencies**:
   ```powershell
   # Frontend
   cd NightMarket/frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

2. **Configure environment variables**:
   - Frontend `.env` is already configured with testnet defaults
   - Backend `.env` is ready for local development
   - Update `CONTRACT_ADDRESS` after deploying your Compact contract

### Running the Application

1. **Start backend server**:
   ```powershell
   cd NightMarket/backend
   node index.js
   ```
   Backend runs at `http://localhost:3000`

2. **Start frontend dev server**:
   ```powershell
   cd NightMarket/frontend
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

3. **Connect wallet**:
   - Open http://localhost:5173 in Chrome
   - Click "Connect Wallet" button
   - Approve connection in Lace wallet popup
   - Your address will be displayed when connected

## 📚 Key Files

### Frontend
- `src/hooks/useMidnightWallet.jsx` - Wallet connection logic
- `src/hooks/useMidnightContract.jsx` - Contract deployment/interaction
- `src/contexts/WalletContext.jsx` - Global wallet state provider
- `src/lib/setupProviders.js` - Midnight SDK provider configuration
- `src/components/WalletConnect.jsx` - Wallet UI component
- `src/App.jsx` - Main application with wallet integration
- `src/main.jsx` - App entry point with WalletProvider wrapper

### Backend
- `index.js` - Express server with dotenv configuration
- `.env` - Environment variables (network, RPC URLs, contract address)

## 🔜 Next Steps (Phase 2)

### Smart Contract Development
- [ ] Author Compact contract (`contracts/src/nightmarket-contract.compact`)
  - `createMarket(title, outcomes, endTime)` function
  - `placeBet(marketId, outcome, amount)` with ZK proof
  - `resolveMarket(marketId, winningOutcome)` function
  - State management for markets and bets
- [ ] Compile contract with `compact build`
- [ ] Deploy to Midnight testnet
- [ ] Update `CONTRACT_ADDRESS` in `.env` files

### Market UI Components
- [ ] `MarketList.jsx` - Browse active markets
- [ ] `MarketDetails.jsx` - View single market with odds
- [ ] `CreateMarket.jsx` - Form to create new markets
- [ ] `ShieldedBetForm.jsx` - Place bets with ZK proof generation
- [ ] React Router setup for navigation

### Backend API Routes
- [ ] `GET /api/markets` - Fetch markets from indexer
- [ ] `POST /api/markets` - Create market (calls contract)
- [ ] `POST /api/markets/:id/bet` - Submit bet transaction
- [ ] `POST /api/markets/:id/resolve` - Resolve with oracle data
- [ ] Oracle service integration for outcome data

### ZK-KYC Integration (Phase 3)
- [ ] VC issuer integration for region verification
- [ ] Proof circuit for KYC credential verification
- [ ] Selective disclosure for regulatory compliance

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Midnight JS SDK
- **Backend**: Node.js, Express, dotenv, axios
- **Wallet**: Lace Midnight Preview
- **Network**: Midnight Testnet
- **Smart Contracts**: Compact (to be implemented)
- **Proof Generation**: Midnight Proof Server (Docker)

## 📖 Documentation References

- [Midnight Wallet Integration](https://docs.midnight.network/how-to/react-wallet-connect)
- [MeshJS Midnight Setup](https://meshjs.dev/midnight/midnight-setup/wallet)
- [Midnight Installation Guide](https://docs.midnight.network/getting-started/installation)

## 🔐 Security Notes

- **Never commit `.env` files** to version control (already in `.gitignore`)
- **Store seed phrases offline** in secure locations
- **Test with testnet tokens** before mainnet deployment
- **Review smart contract code** thoroughly before deployment

## 🤝 Current Status

**✅ Wallet Integration: Complete**
- Full Lace wallet connectivity
- Provider configuration
- Contract deployment/join ready
- UI/UX implemented

**⏳ Next: Smart Contract Implementation**
- Compact contract authoring
- Market creation/betting logic
- ZK proof circuits

---

*Built with 🌙 on Midnight Network*
