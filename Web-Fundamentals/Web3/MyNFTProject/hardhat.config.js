require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [privateKey],
      chainId: 11155111, // <-- 核心修正: 明确指定 Chain ID
    },
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || "",
      accounts: [privateKey],
      chainId: 80002, // <-- 核心修正: 明确指定 Chain ID
    },
    optimismSepolia: {
      url: process.env.OPTIMISM_SEPOLIA_RPC_URL || "",
      accounts: [privateKey],
      chainId: 11155420, // <-- 核心修正: 明确指定 Chain ID
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
      optimismSepolia: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
    },
  },
};