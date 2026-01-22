# MyERC20 Token Project

一个基于 Hardhat 的 ERC20 代币智能合约项目，支持多链部署（Polygon Amoy、Base Sepolia、BSC Testnet）。

## 项目简介

本项目实现了一个自定义的 ERC20 代币合约 `MyERC20`，包含标准的 ERC20 功能：
- ✅ 代币转账 (`transfer`)
- ✅ 授权转账 (`approve` 和 `transferFrom`)
- ✅ 余额查询 (`balanceOf`)
- ✅ 授权额度查询 (`allowance`)

## 技术栈

- **Solidity**: ^0.8.19
- **Hardhat**: ^2.19.4
- **OpenZeppelin Contracts**: ^5.0.1
- **Ethers.js**: v6.x

## 项目结构

```
my-erc20-project-trae/
├── contracts/           # 智能合约目录
│   └── MyToken.sol     # ERC20 代币合约
├── scripts/            # 部署脚本
│   └── deploy.js       # 部署脚本
├── deployments/        # 部署信息（自动生成）
│   ├── amoy/          # Polygon Amoy 部署信息
│   ├── base-sepolia/  # Base Sepolia 部署信息
│   └── bsc_testnet/   # BSC Testnet 部署信息
├── hardhat.config.js   # Hardhat 配置文件
├── .env                # 环境变量配置
└── package.json        # 项目依赖
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env` 文件并填入你的私钥和 API 密钥：

```bash
# .env 文件内容
PRIVATE_KEY="your_wallet_private_key_here"
POLYGONSCAN_API_KEY="your_polygonscan_api_key"
BASESCAN_API_KEY="your_basescan_api_key"
BSCSCAN_API_KEY="your_bscscan_api_key"
```

> ⚠️ **安全提示**: 
> - 请勿将真实的私钥提交到 Git 仓库
> - 使用测试钱包进行开发和测试
> - 确保 `.env` 文件已添加到 `.gitignore`

### 3. 编译合约

```bash
npm run compile
```

### 4. 部署合约

#### 部署到 Polygon Amoy 测试网

```bash
npm run deploy:amoy
```

#### 部署到 Base Sepolia 测试网

```bash
npm run deploy:base
```

#### 部署到 BSC 测试网

```bash
npm run deploy:bsc
```

#### 一键部署到所有网络

```bash
npm run deploy:all
```

## 部署信息

部署成功后，合约地址和 ABI 会自动保存到 `deployments/<network>/MyERC20.json` 文件中。

示例输出：
```
MyERC20 deployed to: 0x38376e59e0d3b9E535832a0980A260a3c9EF305c
Contract address and ABI saved to: /path/to/deployments/amoy/MyERC20.json
```

## 支持的网络

| 网络 | RPC URL | 区块浏览器 |
|------|---------|-----------|
| Polygon Amoy | https://rpc-amoy.polygon.technology/ | https://amoy.polygonscan.com/ |
| Base Sepolia | https://sepolia.base.org | https://sepolia.basescan.org/ |
| BSC Testnet | https://data-seed-prebsc-1-s1.bnbchain.org:8545 | https://testnet.bscscan.com/ |

## 代币参数

默认部署参数（可在 `scripts/deploy.js` 中修改）：
- **代币名称**: MyERC20Token
- **代币符号**: MET
- **初始供应量**: 1,000,000 MET
- **精度**: 18 位小数

## 合约验证

部署后可以在对应的区块浏览器上验证合约：

```bash
npx hardhat verify --network <network-name> <contract-address> "MyERC20Token" "MET" "1000000000000000000000000"
```

## 常见问题

### Node.js 版本警告

如果看到 Node.js 版本不支持的警告，建议使用 LTS 版本（v18.x 或 v20.x）：

```bash
nvm use 18  # 或 nvm use 20
```

### 部署失败

1. 确保钱包有足够的测试币
2. 检查 `.env` 文件配置是否正确
3. 确认网络 RPC 是否可用

## 获取测试币

- **Polygon Amoy**: https://faucet.polygon.technology/
- **Base Sepolia**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **BSC Testnet**: https://testnet.bnbchain.org/faucet-smart

## 开发者信息

- **License**: ISC
- **Solidity Version**: 0.8.20

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

ISC License