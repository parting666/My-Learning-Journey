const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  const initialSupply = hre.ethers.parseEther("1000000"); // 100万枚（假设18位精度）
  const MyERC20 = await hre.ethers.getContractFactory("MyERC20");
  
  // 确保参数顺序与合约构造函数一致
  // 例如：名称、符号、初始供应量（如果合约构造函数是这三个参数）
  const myERC20 = await MyERC20.deploy("MyERC20Token", "MET", initialSupply);

  await myERC20.waitForDeployment();
  const contractAddress = await myERC20.getAddress();

  console.log(`MyERC20 deployed to: ${contractAddress}`);

  // 保存合约地址和ABI
  const artifacts = await hre.artifacts.readArtifact("MyERC20"); // 注意：这里用 await
  
  const deploymentInfo = { 
    address: contractAddress, 
    abi: artifacts.abi 
  }; 

  const networkName = hre.network.name; 
  const outputDir = path.join(__dirname, "..", "deployments", networkName); 
  
  if (!fs.existsSync(outputDir)) { 
    fs.mkdirSync(outputDir, { recursive: true }); 
  } 

  const outputPath = path.join(outputDir, "MyERC20.json"); 
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2)); 

  console.log(`Contract address and ABI saved to: ${outputPath}`); 
} 

main().catch((error) => { 
  console.error(error); 
  process.exitCode = 1; 
});