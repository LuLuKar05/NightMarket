# 📁 NightMarket Project Structure

```
NightMarket/
├── backend/
│   ├── node_modules/
│   ├── .env                      # Backend environment variables
│   ├── index.js                  # Express server with dotenv config
│   ├── package.json              # Backend dependencies (express, cors, dotenv, axios)
│   └── package-lock.json
│
├── contracts/
│   └── src/
│       └── nightmarket-contract.compact  # Compact smart contract (to be implemented)
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   │
│   │   ├── components/
│   │   │   └── WalletConnect.jsx          # ✅ Wallet connection UI component
│   │   │
│   │   ├── contexts/
│   │   │   └── WalletContext.jsx          # ✅ Global wallet state provider
│   │   │
│   │   ├── hooks/
│   │   │   ├── useMidnightWallet.jsx      # ✅ Wallet connection hook
│   │   │   └── useMidnightContract.jsx    # ✅ Contract interaction hook
│   │   │
│   │   ├── lib/
│   │   │   └── setupProviders.js          # ✅ Midnight SDK provider configuration
│   │   │
│   │   ├── App.css                         # ✅ Application styles (purple theme)
│   │   ├── App.jsx                         # ✅ Main app with wallet integration
│   │   ├── index.css                       # Global styles
│   │   └── main.jsx                        # ✅ Entry point with WalletProvider
│   │
│   ├── .env                                # ✅ Frontend environment variables
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html                          # HTML entry point
│   ├── package.json                        # ✅ Frontend dependencies (React, Midnight SDK)
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js                      # Vite configuration
│
├── .gitignore
├── README.md                               # Project overview
├── WALLET_INTEGRATION.md                   # ✅ Wallet integration documentation
└── TESTING_GUIDE.md                        # ✅ Testing checklist and guide

```

## 📦 Installed Packages

### Frontend Dependencies
```json
{
  "@meshsdk/midnight-setup": "^1.9.0-beta.87",
  "@midnight-ntwrk/dapp-connector-api": "^3.0.0",
  "@midnight-ntwrk/midnight-js-fetch-zk-config-provider": "^2.0.2",
  "@midnight-ntwrk/midnight-js-http-client-proof-provider": "^2.0.2",
  "@midnight-ntwrk/midnight-js-indexer-public-data-provider": "^2.0.2",
  "@midnight-ntwrk/midnight-js-level-private-state-provider": "^2.0.2",
  "@midnight-ntwrk/midnight-js-network-id": "^2.0.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6"
}
```

### Backend Dependencies
```json
{
  "express": "^5.1.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "axios": "^1.8.4"
}
```

## 🔑 Key Implementation Files

### Wallet Integration Core

#### `useMidnightWallet.jsx`
- Manages Lace wallet connection state
- `connectWallet()` - Connect to Lace via `window.midnight.mnLace`
- `disconnectWallet()` - Disconnect wallet
- `checkConnection()` - Auto-restore previous connection
- Returns: `{ walletState, isConnected, isLoading, error }`

#### `setupProviders.js`
- Configures all Midnight SDK providers
- `privateStateProvider` - IndexedDB storage
- `zkConfigProvider` - ZK proof config fetcher
- `proofProvider` - HTTP proof generation client
- `publicDataProvider` - Blockchain indexer
- `walletProvider` - Lace wallet integration
- `midnightProvider` - Transaction submitter

#### `useMidnightContract.jsx`
- Smart contract deployment and interaction
- `deployContract(contractInstance)` - Deploy new contract
- `joinContract(contractInstance, address)` - Join existing contract
- `getContractState()` - Query contract state
- `getLedgerState()` - Query ledger state

#### `WalletContext.jsx`
- React Context Provider for wallet state
- Wraps entire app in `main.jsx`
- `useWallet()` hook for accessing wallet anywhere

#### `WalletConnect.jsx`
- UI component with connect/disconnect buttons
- Shows connection status (green dot)
- Displays truncated wallet address
- Error message display

## 🎯 Component Flow

```
App Launch
    ↓
main.jsx
    ↓
<WalletProvider>              ← Creates wallet context
    ↓
  <App />                     ← Main application
    ↓
<WalletConnect />             ← Wallet UI component
    ↓
User clicks "Connect Wallet"
    ↓
useMidnightWallet.connectWallet()
    ↓
window.midnight.mnLace.enable()
    ↓
Lace wallet popup appears
    ↓
User approves connection
    ↓
walletAPI.state() → Get address
    ↓
walletAPI.serviceUriConfig() → Get URIs
    ↓
State updates: isConnected = true
    ↓
UI shows connected state
```

## 🔄 Data Flow for Contract Interaction

```
User wants to interact with contract
    ↓
useMidnightContract.deployContract(contractInstance)
    ↓
setupProviders()              ← Configure all providers
    ↓
MidnightSetupAPI.deployContract(providers, contractInstance)
    ↓
Proof generation (via prover URI)
    ↓
Transaction balancing (walletAPI.balanceAndProveTransaction)
    ↓
Transaction submission (walletAPI.submitTransaction)
    ↓
Contract deployed on Midnight Network
    ↓
api.deployedContractAddress returned
```

## 🌐 Environment Variables

### Frontend `.env`
```env
VITE_MIDNIGHT_NETWORK=testnet
VITE_CONTRACT_ADDRESS=           # Set after contract deployment
VITE_BACKEND_URL=http://localhost:3000
VITE_MIDNIGHT_RPC_URL=https://rpc.testnet.midnight.network
```

### Backend `.env`
```env
PORT=3000
NODE_ENV=development
MIDNIGHT_RPC_URL=https://rpc.testnet.midnight.network
MIDNIGHT_NETWORK=testnet
CONTRACT_ADDRESS=                # Set after contract deployment
ORACLE_API_URL=                  # For future oracle integration
ORACLE_API_KEY=
PROOF_SERVER_URL=http://localhost:6300
KYC_ISSUER_PUBLIC_KEY=          # For future ZK-KYC
```

## 📊 State Management

### Wallet State
```typescript
walletState = {
  state: {
    address: string,              // User's wallet address
    coinPublicKey: PublicKey,     // For transactions
    encryptionPublicKey: PublicKey // For private data
  },
  uris: {
    indexerUri: string,           // Blockchain indexer
    indexerWsUri: string,         // Indexer websocket
    proverServerUri: string       // ZK proof server
  },
  walletAPI: {
    state: () => Promise<WalletState>,
    balanceAndProveTransaction: (tx, coins) => Promise<...>,
    submitTransaction: (tx) => Promise<...>
  }
}
```

### Contract API State
```typescript
api = {
  deployedContractAddress: string,
  getContractState: () => Promise<ContractStateData>,
  getLedgerState: () => Promise<LedgerStateData>
}
```

## 🎨 Styling

- **Theme**: Dark mode with purple/indigo gradient accents
- **Primary Color**: `#8b5cf6` (purple-500)
- **Accent Color**: `#a78bfa` (purple-400)
- **Layout**: Flexbox with header, main content, footer
- **Responsive**: Mobile-first with breakpoints at 768px
- **Fonts**: Default system font stack

## 🚀 Running the Application

```powershell
# Terminal 1: Backend
cd NightMarket/backend
node index.js

# Terminal 2: Frontend
cd NightMarket/frontend
npm run dev

# Terminal 3: Proof Server (optional)
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

## ✅ Implementation Status

| Feature | Status | File(s) |
|---------|--------|---------|
| Wallet Connection | ✅ Complete | `useMidnightWallet.jsx` |
| Provider Setup | ✅ Complete | `setupProviders.js` |
| Context Provider | ✅ Complete | `WalletContext.jsx` |
| Contract Hook | ✅ Complete | `useMidnightContract.jsx` |
| UI Component | ✅ Complete | `WalletConnect.jsx` |
| App Integration | ✅ Complete | `App.jsx`, `main.jsx` |
| Styling | ✅ Complete | `App.css` |
| Backend API | ✅ Complete | `backend/index.js` |
| Environment Config | ✅ Complete | `.env` files |
| Documentation | ✅ Complete | `WALLET_INTEGRATION.md` |
| Testing Guide | ✅ Complete | `TESTING_GUIDE.md` |

---

**Next Steps**: Implement Compact smart contract and market UI components
