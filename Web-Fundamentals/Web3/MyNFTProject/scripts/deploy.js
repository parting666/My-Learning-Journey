const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// =================== 用户配置区 ===================
const CONFIG = {
  TOKEN_NAME: "MyNFT",
  TOKEN_SYMBOL: "MNFT"
};
// ================================================

const deploymentsFilePath = path.join(__dirname, "../deployments.json");

function getDeployments() {
  if (fs.existsSync(deploymentsFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(deploymentsFilePath, "utf8"));
    } catch (e) {
      console.error("Error parsing deployments.json, starting with a new object.", e);
    }
  }
  return {};
}

function saveDeployments(deployments) {
  fs.writeFileSync(
    deploymentsFilePath,
    JSON.stringify(deployments, null, 2)
  );
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;
  // --- 核心改动: 获取 Chain ID ---
  const chainId = hre.network.config.chainId;

  console.log(`🚀 Deploying to network: ${networkName} (Chain ID: ${chainId}) by ${deployer.address}`);
  console.log(`Deploying contract with Name: "${CONFIG.TOKEN_NAME}" and Symbol: "${CONFIG.TOKEN_SYMBOL}"`);

  const constructorArgs = [deployer.address, CONFIG.TOKEN_NAME, CONFIG.TOKEN_SYMBOL];
  const myNFT = await hre.ethers.deployContract("MyNFT", constructorArgs);
  await myNFT.waitForDeployment();
  const contractAddress = myNFT.target;

  console.log(`\n✅ Contract deployed successfully on ${networkName} at: ${contractAddress}`);

  const deployments = getDeployments();
  // --- 核心改动: 使用 chainId 作为 key ---
  deployments[chainId] = contractAddress;
  saveDeployments(deployments);

  console.log(`💾 Deployment address for Chain ID ${chainId} saved to deployments.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});