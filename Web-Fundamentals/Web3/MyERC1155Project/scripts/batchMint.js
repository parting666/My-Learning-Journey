const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// =================== 用户配置区 ===================
const CONFIG = {
  // 留空则自动使用部署者地址 / Leave empty to use deployer's address
  RECIPIENT_ADDRESS: process.env.RECIPIENT_ADDRESS || "", 
  URIS_FILE_PATH: path.join(__dirname, "../assets/output/ERC1155_tokenURIs.json"),
};
// ================================================

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;
  const recipient = CONFIG.RECIPIENT_ADDRESS || deployer.address;

  const deploymentsFilePath = path.join(__dirname, "../deployments.json");
  if (!fs.existsSync(deploymentsFilePath)) {
    return console.error(`❌ Error: deployments.json not found. Please deploy first.`);
  }

  const deployments = JSON.parse(fs.readFileSync(deploymentsFilePath, "utf-8"));
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

  const myNFT = await hre.ethers.getContractAt("MyERC1155Token", contractAddress);
  const tokenURIs = JSON.parse(fs.readFileSync(CONFIG.URIS_FILE_PATH, "utf-8"));

  console.log(`Found ${tokenURIs.length} items in JSON (mapped to IDs).`);

  for (let i = 0; i < tokenURIs.length; i++) {
    const id = i;
    const amount = 1; // Default amount to mint per batch execution
    console.log(`\nMinting Token ID #${id} (Amount: ${amount}) to ${recipient}...`);
    
    // 1. Mint
    const tx = await myNFT.mint(recipient, id, amount, "0x");
    await tx.wait();
    console.log(`✅ Minted. Hash: ${tx.hash}`);

    // 2. Set Token URI
    const uri = tokenURIs[i];
    console.log(`Setting URI for Token ID #${id} to ${uri}...`);
    const uriTx = await myNFT.setTokenURI(id, uri);
    const receipt = await uriTx.wait();
    console.log(`✅ URI set. Hash: ${receipt.hash}`);
  }

  console.log("\n🎉 Batch minting complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
