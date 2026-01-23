const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// =================== 用户配置区 ===================
const CONFIG = {
  RECIPIENT_ADDRESS: "", // 留空则自动使用部署者地址
  URIS_FILE_PATH: path.join(__dirname, "../assets/output/_tokenURIs.json"),
};
// ================================================

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;
  // --- 核心改动: 获取 Chain ID ---
  const chainId = hre.network.config.chainId;
  const recipient = CONFIG.RECIPIENT_ADDRESS || deployer.address;

  const deploymentsFilePath = path.join(__dirname, "../deployments.json");
  if (!fs.existsSync(deploymentsFilePath)) {
    return console.error(`❌ Error: deployments.json not found. Please deploy first.`);
  }

  const deployments = JSON.parse(fs.readFileSync(deploymentsFilePath, "utf-8"));
  // --- 核心改动: 使用 chainId 来查找合约地址 ---
  const contractAddress = deployments[chainId];

  if (!contractAddress) {
    return console.error(`❌ Error: No contract address found for Chain ID '${chainId}' in deployments.json.`);
  }
  if (!fs.existsSync(CONFIG.URIS_FILE_PATH)) {
    return console.error(`❌ Error: Token URIs file not found. Run 'batchUpload.js' first.`);
  }

  console.log(`🚀 Starting batch mint on network: ${networkName} (Chain ID: ${chainId})`);
  console.log("Using contract at:", contractAddress);
  console.log("Minting to:", recipient);

  const myNFT = await hre.ethers.getContractAt("MyNFT", contractAddress);
  const tokenURIs = JSON.parse(fs.readFileSync(CONFIG.URIS_FILE_PATH, "utf-8"));

  console.log(`Found ${tokenURIs.length} NFTs to mint.`);

  for (let i = 0; i < tokenURIs.length; i++) {
    console.log(`\nMinting NFT #${i + 1}/${tokenURIs.length}...`);
    const tx = await myNFT.safeMint(recipient, tokenURIs[i]);
    const receipt = await tx.wait();
    console.log(`✅ Transaction successful! Hash: ${receipt.hash}`);
  }

  console.log("\n🎉 Batch minting complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});