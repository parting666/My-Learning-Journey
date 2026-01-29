# Dapp Token Factory

This is a full-stack dApp for deploying and managing ERC20, ERC721, and ERC1155 smart contracts on EVM-compatible networks. It features a modern Vue 3 frontend and a Hardhat-based smart contract backend.

## Features

- **Multi-Chain Support**: Deploy to Ethereum, Polygon, BSC, Arbitrum, Optimism, Base, and their testnets.
- **Contract Factory**: Easily deploy standard ERC20 Tokens, ERC721 NFTs, and ERC1155 Multi-Tokens via the UI.
- **Asset Management**: View local wallet balances and manage your deployed contracts.
- **Local Persistence**: Deployed contracts are saved locally in the browser for easy access.

## Project Structure

- `frontend/`: Vue 3 + Vite + TailwindCSS application.
- `smartcontracts/`: Hardhat project for Solidity contracts and deployment scripts.

## Prerequisites

- Node.js (v18+ recommended)
- MetaMask (or another EVM wallet extension)

## Quick Start

### 1. Install Dependencies

**Smart Contracts:**
```bash
cd smartcontracts
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Environment Setup

**Smart Contracts:**
Copy `.env.example` to `.env` and fill in your details (optional for local testing, required for public networks).
```bash
cd smartcontracts
cp .env.example .env
```

**Frontend:**
Copy `.env.example` to `.env`.
```bash
cd frontend
cp .env.example .env
```

### 3. Compile Contracts

Before running the frontend, ensure artifacts are generated and synced.
```bash
cd smartcontracts
npx hardhat compile
node scripts/update-frontend-artifact.js
```

### 4. Run Locally

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

**Optional: Local Hardhat Network**
If you want to test on a local blockchain:
```bash
cd smartcontracts
npx hardhat node
```
Then connect your MetaMask to `Localhost 8545` (Chain ID: 31337).

## Troubleshooting

### Common Errors

**1. `call revert exception` or `gas estimation failed`**
- Ensure you have enough native tokens (ETH/MATIC) for gas.
- If using Localhost, ensure `npx hardhat node` is running and you reset your MetaMask account (Settings > Advanced > Clear Activity Tab Data) if you restarted the node.

**2. `Cannot redefine property: ethereum`**
- This is caused by conflicting browser extensions (e.g., having both Phantom and MetaMask enabled).
- **Fix**: Disable conflicting wallet extensions and reload the page.

**3. `invalid BytesLike value` on deployment**
- This usually means the frontend artifacts are stale.
- **Fix**: Run `npx hardhat compile` and `node scripts/update-frontend-artifact.js` in the `smartcontracts` directory.

### Contact & Support

For issues, please open a GitHub issue or contact the maintainer.
