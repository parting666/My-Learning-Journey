
const fs = require("fs");
const path = require("path");

const CONFIG = {
  COLLCETION_NAME: "我的文具卡通ERC1155集合",
  COLLCETION_DESCRIPTION: "这是个高度可配置、可重用的文具卡通ERC1155集合。"
}

const deploymentsFilePath = path.join(__dirname, "../deployments.json");
function getDeployments() {
  if (fs.existsSync(deploymentsFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(deploymentsFilePath, "utf-8"));
    } catch (e) {
      console.error("Error reading deployments.json", e);
    }
  }
  return {};
}
function saveDeployments(deployments) {
  try {
    fs.writeFileSync(deploymentsFilePath, JSON.stringify(deployments, null, 2));
  } catch (e) {
    console.error("Error writing deployments.json", e);
  }
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const chainId = hre.network.config.chainId;
  const networkName = hre.network.name;
  console.log("deploy to chainId:", chainId, "networkName:", networkName);
  const MyERC1155Token = await hre.ethers.getContractFactory("MyERC1155Token");

  // 部署合约，这里的部署函数签名与 v5 保持一致
  const myERC1155Token = await MyERC1155Token.deploy(deployer.address);

  // 🚨 核心修改 1: 将 .deployed() 替换为 .waitForDeployment()
  await myERC1155Token.waitForDeployment();

  // 🚨 核心修改 2: 获取地址的方法变为异步的 .getAddress()
  const contractAddress = await myERC1155Token.getAddress();

  console.log("MyERC1155Token deployed to:", contractAddress);



  //保存部署信息
  const deployments = getDeployments();
  deployments[chainId] = contractAddress;

  saveDeployments(deployments);
  console.log("saved deployments to deployments.json", deployments);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });