# 🚀 Quick Start Commands

## Prerequisites Setup

### 1. Install Lace Wallet
```
Visit: https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg
- Install extension
- Create wallet
- Save seed phrase securely
```

### 2. Get Testnet Tokens
```
Visit: https://midnight.network/test-faucet/
- Copy your Lace wallet address
- Request tDUST tokens
```

### 3. Start Local Proof Server (Optional)
```powershell
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

Then in Lace wallet: Settings → Midnight → Select "Local (http://localhost:6300)"

## Running NightMarket

### Start Backend (Terminal 1)
```powershell
cd NightMarket/backend
node index.js
```
**Output:**
```
🚀 NightMarket Backend running on http://localhost:3000
📡 Network: testnet
🔐 Environment: development
```

### Start Frontend (Terminal 2)
```powershell
cd NightMarket/frontend
npm run dev
```
**Output:**
```
VITE v7.2.2  ready in 567 ms
➜  Local:   http://localhost:5173/
```

### Access Application
Open browser: **http://localhost:5173**

## Testing Commands

### Test Backend Health
```powershell
curl http://localhost:3000/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-18T...",
  "network": "testnet"
}
```

### Check Frontend Build
```powershell
cd NightMarket/frontend
npm run build
```

### Run Production Preview
```powershell
cd NightMarket/frontend
npm run preview
```

## Development Commands

### Install Dependencies
```powershell
# Frontend
cd NightMarket/frontend
npm install

# Backend
cd NightMarket/backend
npm install
```

### Check for Updates
```powershell
# Frontend
cd NightMarket/frontend
npm outdated

# Backend
cd NightMarket/backend
npm outdated
```

### View Environment Variables
```powershell
# Frontend
cd NightMarket/frontend
cat .env

# Backend
cd NightMarket/backend
cat .env
```

## Debugging Commands

### View Frontend Console Logs
Open browser DevTools (F12) → Console tab

### View Backend Logs
Backend logs appear in the terminal where `node index.js` is running

### Check Wallet Connection in Browser Console
```javascript
// Check if Lace is installed
window.midnight?.mnLace

// Check wallet state (after connecting)
const wallet = window.midnight?.mnLace;
const api = await wallet.enable();
await api.state();
```

## Cleanup Commands

### Stop Servers
Press `Ctrl+C` in each terminal running the servers

### Clear Node Modules (if issues)
```powershell
# Frontend
cd NightMarket/frontend
Remove-Item -Recurse -Force node_modules
npm install

# Backend
cd NightMarket/backend
Remove-Item -Recurse -Force node_modules
npm install
```

### Clear Browser Cache
In Chrome: `Ctrl+Shift+Delete` → Clear cached images and files

## Git Commands

### Check Status
```powershell
cd NightMarket
git status
```

### Commit Changes
```powershell
git add .
git commit -m "feat: implement Midnight wallet integration"
git push origin main
```

### View Changes
```powershell
git diff
```

## Docker Commands (Proof Server)

### Start Proof Server
```powershell
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

### Run in Background
```powershell
docker run -d -p 6300:6300 --name midnight-prover midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

### Check Running Containers
```powershell
docker ps
```

### Stop Proof Server
```powershell
docker stop midnight-prover
```

### View Proof Server Logs
```powershell
docker logs midnight-prover
```

## Useful URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Backend Health**: http://localhost:3000/health
- **Proof Server**: http://localhost:6300
- **Lace Wallet**: chrome-extension://hgeekaiplokcnmakghbdfbgnlfheichg/app.html
- **Midnight Faucet**: https://midnight.network/test-faucet/
- **Midnight Docs**: https://docs.midnight.network
- **MeshJS Midnight**: https://meshjs.dev/midnight/midnight-setup

## Environment Variable Reference

### Frontend (.env)
```env
VITE_MIDNIGHT_NETWORK=testnet
VITE_CONTRACT_ADDRESS=
VITE_BACKEND_URL=http://localhost:3000
VITE_MIDNIGHT_RPC_URL=https://rpc.testnet.midnight.network
```

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MIDNIGHT_RPC_URL=https://rpc.testnet.midnight.network
MIDNIGHT_NETWORK=testnet
CONTRACT_ADDRESS=
ORACLE_API_URL=
ORACLE_API_KEY=
PROOF_SERVER_URL=http://localhost:6300
KYC_ISSUER_PUBLIC_KEY=
```

## Troubleshooting

### Wallet Not Detected
```javascript
// In browser console, check:
window.midnight?.mnLace
// If undefined, reinstall Lace extension
```

### Connection Fails
1. Check Lace wallet is unlocked
2. Check proof server is running (if using local)
3. Check browser console for errors
4. Try refreshing page

### Build Errors
```powershell
# Clear cache and reinstall
cd NightMarket/frontend
Remove-Item -Recurse -Force node_modules, dist
npm install
```

### Port Already in Use
```powershell
# Backend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Next Steps

1. ✅ Wallet integration complete
2. ⏳ Author Compact smart contract
3. ⏳ Deploy contract to testnet
4. ⏳ Build market UI components
5. ⏳ Implement betting flow
6. ⏳ Add oracle integration

---

**Quick tip**: Keep this file open in a separate tab for easy command reference during development!
