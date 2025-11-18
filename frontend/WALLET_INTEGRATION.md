# Midnight Wallet Integration

This project now uses **real Midnight Network wallet integration** via the Lace Beta Wallet.

## Prerequisites

1. **Install Lace Beta Wallet** browser extension:
   - Chrome Web Store: https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg
   - Only compatible with Google Chrome

2. **Create a wallet** and get test tokens:
   - Follow the setup wizard in Lace wallet
   - Get tDUST tokens from: https://midnight.network/test-faucet/

## Features

✅ **Real Wallet Connection** - Connects to actual Lace Beta Wallet
✅ **Address Display** - Shows truncated wallet address (e.g., mn_shi...k9xu)
✅ **Connection State** - Real-time connection status
✅ **Error Handling** - Displays wallet errors to users
✅ **Disconnect Support** - Proper wallet disconnection

## How It Works

### 1. Wallet Hook (`useMidnightWallet`)
Located in `src/hooks/useMidnightWallet.js`, this hook handles:
- Connecting to `window.midnight.mnLace` API
- Enabling wallet access (requires user approval)
- Getting wallet state (address, keys)
- Disconnecting from wallet
- Error management

### 2. App Integration
The main `App.jsx` uses the hook to:
- Show "Connect Wallet" button when disconnected
- Display wallet address when connected
- Handle loading states ("Connecting...")
- Show error messages

### 3. Type Definitions
`src/types/midnight.d.ts` provides TypeScript types for the Midnight API.

## Testing

1. Start the dev server:
```bash
npm run dev
```

2. Open http://localhost:5173/ in Chrome

3. Click "Connect Wallet"

4. Approve the connection in Lace wallet popup

5. Your wallet address will display in the header

## Common Errors

### "Please install Lace Beta Wallet for Midnight Network"
- Install the Lace Beta Wallet extension from Chrome Web Store
- Refresh the page

### "User rejected"
- User denied the wallet connection request
- Click "Connect Wallet" again and approve

### Connection Issues
- Make sure Lace wallet is unlocked
- Check that you're using Google Chrome
- Ensure the wallet extension is enabled

## Next Steps

To fully integrate with contracts, you'll need to:
1. Set up providers (ZK config, proof, indexer, private state)
2. Deploy or join contracts using `MidnightSetupAPI`
3. Use `walletAPI.balanceAndProveTransaction()` for bets
4. Use `walletAPI.submitTransaction()` to submit to network

## Documentation

- [Midnight Wallet Guide](https://docs.midnight.network/develop/guides/wallet-dev-guide)
- [React Wallet Connect](https://docs.midnight.network/how-to/react-wallet-connect)
- [Mesh SDK Wallet Integration](https://meshjs.dev/midnight/midnight-setup/wallet)
- [Integration Examples](https://meshjs.dev/midnight/midnight-setup/examples)
