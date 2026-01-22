# My ERC20 Token Project

这是一个使用 Hardhat 框架部署的 ERC20 智能合约项目。

## 功能

-   一个基本的 ERC20 代币合约
-   使用 OpenZeppelin 库，确保安全
-   支持在 Polygon Amoy、Base Sepolia 和 BSC Testnet 上部署

## 部署说明

1.  克隆或下载此项目。
2.  安装依赖：`npm install`
3.  在 `.env` 文件中配置您的私钥和 API 密钥。
4.  使用以下命令部署到相应网络：
    -   Polygon Amoy：`npx hardhat run scripts/deploy.js --network amoy`
    -   Base Sepolia：`npx hardhat run scripts/deploy.js --network base-sepolia`
    -   BSC Testnet：`npx hardhat run scripts/deploy.js --network bsc_testnet`