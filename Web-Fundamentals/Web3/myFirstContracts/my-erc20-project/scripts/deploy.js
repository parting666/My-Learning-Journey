const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const initialSupply = hre.ethers.parseEther("1000000"); // 例如，发行100万个代币

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply);

  await myToken.waitForDeployment();
  const contractAddress = await myToken.getAddress();

  console.log(`MyToken deployed to: ${contractAddress}`);

  // 保存合约地址和ABI
  const artifacts = hre.artifacts.readArtifactSync("MyToken");
  
  const deploymentInfo = {
    address: contractAddress,
    abi: artifacts.abi
  };

  const networkName = hre.network.name;
  const outputDir = path.join(__dirname, "..", "deployments", networkName);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "MyToken.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));

  console.log(`Contract address and ABI saved to: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});