# 🌑 Night Market

### The Global Standard for Private, Compliant Prediction Markets

**Night Market** is a privacy-first prediction market built on the Midnight blockchain, leveraging zero-knowledge proofs to enable anonymous betting with planned regulatory compliance features including ZK-KYC verification.

---

## 📋 Table of Contents

- [Vision](#-vision)
- [The Privacy Gap](#-the-privacy-gap)
- [Core Features](#-core-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Strategic Roadmap](#-strategic-roadmap)
- [Value Proposition](#-value-proposition-for-the-midnight-network)
- [Documentation](#-documentation)

---

## 🎯 Vision

Night Market is not just a dApp; it is a **strategic infrastructure play** for the entire Midnight ecosystem and the future of private financial markets.

### The Problem

Current prediction markets (Polymarket, Augur, etc.) operate on fully transparent blockchains where:
- Every bet is publicly visible
- Users expose their financial positions, political leanings, and net worth
- High-net-worth individuals face front-running risks
- Institutions avoid participation due to privacy concerns and regulatory uncertainty

### The Solution

Night Market leverages Midnight's zero-knowledge technology to enable:
- **Private betting** where positions remain shielded from public view
- **Planned compliant participation** through ZK-KYC verification (future: prove you're verified without revealing identity)
- **Institutional-grade privacy** for high-value market participants
- **Regulatory transparency** via selective disclosure mechanisms (roadmap)

---

## 💡 The Privacy Gap

The prediction market sector has seen explosive growth, with platforms reaching billions in volume. However, a critical market opportunity exists:

| Current Markets | Night Market |
|----------------|--------------|
| ❌ Public bet visibility | ✅ Shielded positions |
| ❌ Identity exposure | 🔜 ZK-KYC privacy (planned) |
| ❌ Front-running risk | ✅ Private execution |
| ❌ Institutional hesitancy | 🔜 Compliance-ready (roadmap) |
| ❌ Single-chain limitation | 🔜 Cross-chain settlement (roadmap) |

> **Market Reality:** 80% of institutional investors cite regulatory uncertainty and data privacy as barriers to DeFi entry. Night Market is designed to solve both.

---

## ✨ Core Features

### Phase 1: MVP (Current Implementation)
- 🛡️ **Shielded Betting** - Private position management using zero-knowledge proofs
- 💰 **Shielded Vault** - Secure, private asset custody for betting funds
- 🏭 **Market Factory** - Permissioned market creation system
- 📊 **Resolution Oracle** - Decentralized outcome verification

### Phase 1: MVP (Planned)
- 🔐 **ZK-KYC Integration** - Verify user compliance without revealing identity
- ⚖️ **Compliance Portal** - Regulatory reporting without user doxxing

### Smart Contracts (Compact)
```
contracts/src/
├── ShieldedVault.compact          # Private asset management (✅ Implemented)
├── PositionManager.compact        # Shielded bet tracking (✅ Implemented)
├── PredictionMarketFactory.compact # Market creation & management (✅ Implemented)
├── ResolutionOracle.compact       # Outcome resolution (✅ Implemented)
├── ZKKYCVerifier.compact          # Zero-knowledge KYC verification (🔜 Planned)
└── CompliancePortal.compact       # Regulatory interface (🔜 Planned)
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Market List  │  │Market Detail │  │  Portfolio   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │  Midnight Wallet    │
                   │   (Lace/dApp API)   │
                   └──────────┬──────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                  Midnight Blockchain                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Compact Smart Contracts                   │   │
│  │  • ShieldedVault (✅)  • PositionManager (✅)       │   │
│  │  • PredictionMarketFactory (✅) • ResolutionOracle (✅) │
│  │  • ZKKYCVerifier (🔜) • CompliancePortal (🔜)      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Proof Server    │  │  ZK Config       │                │
│  │  (Port 6300)     │  │  Provider        │                │
│  └──────────────────┘  └──────────────────┘                │
└───────────────────────────────────────────────────────────────┘
```

### Privacy Flow

1. **Deposit**: Assets deposited into ShieldedVault with privacy guarantees
2. **Betting**: Positions created via PositionManager using ZK circuits
3. **Settlement**: Outcomes resolved by oracle, payouts distributed privately
4. **User Verification (Planned)**: KYC verification will happen off-chain, ZK proof generated
5. **Compliance (Planned)**: Regulatory queries answered without revealing individual users

---

## 🔧 Technology Stack

### Frontend
- **React 19.2** - Modern UI framework
- **Vite 7.2** - Lightning-fast build tool
- **React Router 7.9** - Client-side routing
- **Midnight dApp Connector** - Wallet integration

### Smart Contracts
- **Compact** - Midnight's ZK-enabled smart contract language
- **TypeScript** - Witness implementations and contract interfaces

### Backend
- **Node.js + Express** - REST API server
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for external data

### Blockchain Infrastructure
- **Midnight Network** - Privacy-focused blockchain
- **Proof Server** - Zero-knowledge proof generation
- **Indexer** - Public data querying
- **Level DB** - Private state management

---

## 🚀 Quick Start

### Prerequisites

1. **Install Lace Wallet**
   ```bash
   # Visit Chrome Web Store
   https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg
   ```

2. **Get Testnet Tokens**
   ```bash
   # Visit Midnight Faucet
   https://midnight.network/test-faucet/
   ```

3. **Start Proof Server (Optional)**
   ```bash
   docker run -p 6300:6300 midnightnetwork/proof-server -- \
     'midnight-proof-server --network testnet'
   ```

### Installation

```bash
# Clone repository
git clone https://github.com/LuLuKar05/NightMarket.git
cd NightMarket

# Install dependencies
npm install

# Compile smart contracts
npm run compile:all
```

### Running the Application

> **Port Configuration:**  
> - 🖥️ Backend API: `http://localhost:3000`  
> - 🌐 Frontend UI: `http://localhost:5173`  
> - 🔐 Proof Server: `http://localhost:6300` (optional, Docker)

#### Terminal 1: Backend Server (Port 3000)
```bash
cd backend
npm install
node index.js
# 🚀 NightMarket Backend running on http://localhost:3000
```

#### Terminal 2: Frontend Dev Server (Port 5173)
```bash
cd frontend
npm install
npm run dev
# ➜  Local:   http://localhost:5173/
```

#### Terminal 3: Contracts (Development)
```bash
cd contracts
npm install
npm run build
npm run dev  # Watch mode
```

### Environment Variables

Create `.env` files based on the `.env.example` templates:

**Backend** (`backend/.env`):
```env
PORT=3000                    # Backend API server port
NODE_ENV=development
MIDNIGHT_NETWORK=testnet
```

**Frontend** (`frontend/.env`):
```env
VITE_BACKEND_URL=http://localhost:3000      # Backend API endpoint
VITE_MIDNIGHT_NETWORK=testnet
VITE_PROOF_SERVER_URL=http://localhost:6300 # Proof server endpoint
```

> **Note**: Backend runs on port **3000**, Frontend runs on port **5173** (Vite default)

---

## 🗺️ Strategic Roadmap

### Horizon 1: The Sovereign Foundation (Months 1-6) 🚧 In Progress
**Goal:** Prove that privacy and compliance can coexist

- [x] Core Compact contract deployment (4 core contracts)
- [x] Shielded betting infrastructure
- [x] Frontend UI with wallet integration
- [ ] ZK-KYC integration (In Development)
- [ ] Compliance Portal implementation (In Development)
- [ ] Genesis markets (Crypto prices, Major events)
- [ ] Initial liquidity seeding
- [ ] Proof Server cluster establishment

### Horizon 2: Liquidity & The "Night" Economy (Months 6-12)
**Goal:** Deepen liquidity and launch native token economy

- [ ] **$NIGHT Token Launch**
  - Betting asset and staking mechanism
  - Liquidity provider rewards
  - Governance rights for dispute resolution
  
- [ ] **Liquidity Mining Program**
  - Incentivize pool provision
  - Tiered reward system
  - LP token mechanics
  
- [ ] **AMM Integration**
  - ZK-enabled automated market maker
  - Instant betting execution
  - Low-volume market support
  
- [ ] **Privacy-Preserving Referrals**
  - ZK-based commission system
  - Untraceable referral links

### Horizon 3: Decentralization & Oracle Network (Year 1-2)
**Goal:** Remove centralization and empower community

- [ ] **Optimistic Oracle**
  - Community-disputed resolution
  - $NIGHT staking for verification
  - Slashing for false outcomes
  
- [ ] **Permissionless Market Creation**
  - Stake $NIGHT to create markets
  - Decentralized liquidity bootstrapping
  - Creator fee mechanisms
  
- [ ] **Night DAO**
  - Protocol fee governance
  - Compliance parameter voting
  - Treasury management

### Horizon 4: Institutional Bridges & RWAs (Year 2+)
**Goal:** The "Bloomberg Terminal" of Prediction Markets

- [ ] **Institutional Dark Pools**
  - Permissioned private pools
  - Corporate hedging instruments
  - Insurance payouts integration
  
- [ ] **Regulatory APIs**
  - View Key dashboards for auditors
  - Jurisdiction-specific compliance
  - Selective disclosure mechanisms
  
- [ ] **Cross-Chain Settlement**
  - Cardano asset bridging
  - Ethereum interoperability
  - Bitcoin settlement layer
  - Midnight as privacy layer for all chains

---

## 💎 Value Proposition for the Midnight Network

### The "Night" Flywheel 🔄

```
Higher Transaction Volume → More DUST Burned → Network Value ↑
         ↑                                              ↓
    More Liquidity ← More Users Onboarded ← Proven Scalability
```

1. **Liquidity Magnet**
   - High-frequency trading environment
   - Consistent transaction volume
   - DUST burning mechanism
   - Scalability stress-testing

2. **Token Utility**
   - $NIGHT as betting asset (locks supply)
   - Liquidity provider staking
   - Governance participation
   - Market creation collateral

3. **Onboarding Trojan Horse**
   - Appeals to non-crypto natives (sports, politics)
   - Planned ZK-KYC will onboard verified unique humans
   - Creates valuable user base for other Midnight dApps
   - Network effects compound

### Why Night Market is Critical

> **"Night Market is not just building a betting app; we are building the financial privacy layer for the information economy. By leveraging Midnight's unique ZK-tech, we are the only platform capable of serving both the 'cypherpunk' seeking anonymity and the 'institution' seeking compliance. We are the bridge that brings the next 10 million users to Midnight."**

---

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[Port Configuration](./PORT_CONFIGURATION.md)** - Port setup and troubleshooting
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Codebase organization
- **[Frontend Implementation](./FRONTEND_IMPLEMENTATION.md)** - React app details
- **[Wallet Integration](./WALLET_INTEGRATION.md)** - Midnight wallet setup
- **[Component Usage](./COMPONENT_USAGE_GUIDE.md)** - UI component library
- **[Testing Guide](./TESTING_GUIDE.md)** - Testing strategies
- **[MVP Analysis](./MVP_ANALYSIS.md)** - Feature breakdown
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Technical overview

---

## 🏆 Competitive Advantages

| Feature | Polymarket | Augur | Night Market |
|---------|-----------|-------|--------------|
| Privacy | ❌ Public | ❌ Public | ✅ ZK-Shielded |
| Compliance | ❌ Limited | ❌ None | 🔜 ZK-KYC (Planned) |
| Institutional Access | ⚠️ Risky | ❌ No | 🔜 Dark Pools (Roadmap) |
| Front-Running Protection | ❌ No | ❌ No | ✅ Yes |
| Cross-Chain | ⚠️ Polygon | ⚠️ Ethereum | 🔜 Multi-chain (Roadmap) |
| Regulatory API | ❌ No | ❌ No | 🔜 View Keys (Roadmap) |

---

## 📊 Market Opportunity

- **Total Addressable Market (TAM):** $500B+ (Global gambling & derivatives markets)
- **Serviceable Addressable Market (SAM):** $50B+ (Crypto prediction markets)
- **Serviceable Obtainable Market (SOM):** $5B+ (Privacy-focused segment)

### Target Segments

1. **Cypherpunks** - Privacy advocates seeking anonymous betting
2. **Crypto Whales** - High-net-worth individuals avoiding front-running
3. **Institutions** - Hedge funds, insurance companies needing compliant hedging
4. **Regulated Markets** - Jurisdictions requiring KYC but valuing privacy (EU, UK)

---

## 🔒 Security & Audits

### Current Status
- ⏳ **Smart Contract Audits**: Planned for Q2 2026
- ✅ **Proprietary Technology**: Advanced ZK implementations
- ✅ **Testnet Deployment**: Extensive testing on Midnight testnet

### Security Considerations
- All Compact contracts follow Midnight security best practices
- ZK circuits undergo rigorous internal review
- Private keys never exposed on-chain
- Witness implementations type-safe with TypeScript
- Multi-layer security architecture

---

## 🌐 Community & Support

- **Website**: [Coming Soon]
- **Twitter/X**: [@NightMarketDeFi](https://twitter.com/NightMarketDeFi) *(Placeholder)*
- **Discord**: [Join Community](https://discord.gg/nightmarket) *(Placeholder)*
- **Documentation**: [docs.nightmarket.io](https://docs.nightmarket.io) *(Placeholder)*
- **GitHub Issues**: [Report Bugs](https://github.com/LuLuKar05/NightMarket/issues)

---

##  Acknowledgments

- **Midnight Network** - For building the privacy-first blockchain infrastructure
- **Cardano Foundation** - For supporting the broader ecosystem
- **Input Output Global** - For Midnight development and research
- **The Community** - For testing, feedback, and contributions

---

## 🔮 The Future is Private

Night Market represents a fundamental shift in how prediction markets operate. By solving the "Transparency Paradox" through zero-knowledge proofs, we're not just building another DeFi app—we're creating the infrastructure for a more private, compliant, and accessible financial future.

**Join us in building the future of private finance.**

---

<div align="center">

**[Get Started](./QUICKSTART.md)** • **[Read Docs](./FRONTEND_IMPLEMENTATION.md)** • **[Join Community](#-community--support)**

Made with 🌑 by the Night Market team

</div>
