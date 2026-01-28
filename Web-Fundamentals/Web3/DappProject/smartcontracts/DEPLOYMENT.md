# 智能合约部署指南

本指南将帮助您在多个区块链网络上部署 ERC20、ERC721 和 ERC1155 智能合约。

## 目录

- [环境配置](#环境配置)
- [支持的网络](#支持的网络)
- [工厂合约](#工厂合约)
- [部署步骤](#部署步骤)
- [部署命令](#部署命令)
- [合约验证](#合约验证)
- [常见问题](#常见问题)

## 环境配置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入您的配置：

```env
# 私钥（不要包含 0x 前缀）
PRIVATE_KEY=your_private_key_here

# API Keys（用于合约验证）
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
OPTIMISTIC_ETHERSCAN_API_KEY=your_optimistic_etherscan_api_key
BASESCAN_API_KEY=your_basescan_api_key

# RPC URLs（可选，使用 Alchemy、Infura 等服务）
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

> ⚠️ **安全提示**: 
> - 永远不要将 `.env` 文件提交到 Git
> - 使用测试网进行初步测试
> - 确保私钥对应的账户有足够的 gas 费

### 3. 配置部署参数

在 `.env` 文件中设置代币参数：

```env
# ERC20 配置
ERC20_NAME=MyToken
ERC20_SYMBOL=MTK
ERC20_INITIAL_SUPPLY=1000000
ERC20_DECIMALS=18

# ERC721 配置
ERC721_NAME=MyNFT
ERC721_SYMBOL=MNFT
ERC721_BASE_URI=https://api.example.com/metadata/

# ERC1155 配置
ERC1155_NAME=MyMultiToken
ERC1155_SYMBOL=MMT
ERC1155_BASE_URI=https://api.example.com/metadata/{id}.json
```

## 支持的网络

### 主网
- **Ethereum** - 以太坊主网
- **Polygon** - Polygon 主网
- **BSC** - Binance Smart Chain
- **Arbitrum** - Arbitrum One
- **Optimism** - Optimism 主网
- **Base** - Base 主网

### 测试网
- **Sepolia** - 以太坊测试网
- **Mumbai** - Polygon 测试网（即将弃用）
- **BSC Testnet** - BSC 测试网
- **Arbitrum Sepolia** - Arbitrum 测试网
- **Optimism Sepolia** - Optimism 测试网
- **Base Sepolia** - Base 测试网

## 工厂合约

### 什么是工厂合约？

TokenFactory 是一个智能合约工厂，允许用户通过单个合约部署 ERC20、ERC721 和 ERC1155 代币，无需单独部署每个合约。

### 工厂合约优势

- ✅ **简化部署** - 一次交易即可部署代币合约
- ✅ **所有权控制** - 部署的代币所有权自动转移给调用者
- ✅ **部署追踪** - 自动记录所有部署历史
- ✅ **批量管理** - 方便查询和管理多个代币
- ✅ **降低成本** - 减少部署步骤和交易费用

### 部署工厂合约

```bash
# 部署到测试网
npm run deploy:factory -- --network sepolia

# 部署到主网
npm run deploy:factory -- --network ethereum
```

### 使用工厂合约部署代币

部署工厂合约后，可以通过调用工厂合约的函数来部署代币：

#### 1. 部署 ERC20 代币

```javascript
// 使用 ethers.js
const factory = await ethers.getContractAt("TokenFactory", factoryAddress);
const tx = await factory.deployERC20("MyToken", "MTK", 1000000, 18);
const receipt = await tx.wait();

// 从事件中获取新部署的代币地址
const event = receipt.events.find(e => e.event === 'ERC20Deployed');
const tokenAddress = event.args.tokenAddress;
```

#### 2. 部署 ERC721 NFT

```javascript
const tx = await factory.deployERC721(
  "MyNFT", 
  "MNFT", 
  "https://api.example.com/metadata/"
);
const receipt = await tx.wait();
const event = receipt.events.find(e => e.event === 'ERC721Deployed');
const nftAddress = event.args.tokenAddress;
```

#### 3. 部署 ERC1155 多代币

```javascript
const tx = await factory.deployERC1155(
  "MyMultiToken", 
  "MMT", 
  "https://api.example.com/metadata/{id}.json"
);
const receipt = await tx.wait();
const event = receipt.events.find(e => e.event === 'ERC1155Deployed');
const tokenAddress = event.args.tokenAddress;
```

### 查询部署记录

```javascript
// 获取用户部署的所有代币
const userTokens = await factory.getUserDeployments(userAddress);

// 获取所有 ERC20 代币
const allERC20 = await factory.getAllERC20Tokens();

// 获取所有 ERC721 代币
const allERC721 = await factory.getAllERC721Tokens();

// 获取所有 ERC1155 代币
const allERC1155 = await factory.getAllERC1155Tokens();

// 获取总部署数量
const totalDeployments = await factory.getTotalDeployments();

// 获取特定部署的详细信息
const deploymentInfo = await factory.getDeploymentInfo(0); // 第一个部署
// 返回: { tokenAddress, deployer, timestamp, tokenType }
```

### 工厂合约事件

工厂合约会为每次部署触发事件：

```solidity
event ERC20Deployed(
    address indexed tokenAddress,
    address indexed deployer,
    string name,
    string symbol,
    uint256 initialSupply,
    uint8 decimals
);

event ERC721Deployed(
    address indexed tokenAddress,
    address indexed deployer,
    string name,
    string symbol,
    string baseURI
);

event ERC1155Deployed(
    address indexed tokenAddress,
    address indexed deployer,
    string name,
    string symbol,
    string baseURI
);
```

## 部署步骤

### 1. 编译合约

```bash
npm run compile
```

### 2. 部署到本地测试网络

```bash
# 启动本地 Hardhat 网络
npx hardhat node

# 在另一个终端部署
npm run deploy:all -- --network localhost
```

### 3. 部署到测试网

推荐先在测试网部署和测试：

```bash
# 部署所有合约到 Sepolia 测试网
npm run deploy:all -- --network sepolia

# 或单独部署
npm run deploy:erc20 -- --network sepolia
npm run deploy:erc721 -- --network sepolia
npm run deploy:erc1155 -- --network sepolia
```

### 4. 部署到主网

确认测试无误后，部署到主网：

```bash
# 部署到以太坊主网
npm run deploy:all -- --network ethereum

# 部署到 Polygon 主网
npm run deploy:all -- --network polygon

# 部署到 BSC 主网
npm run deploy:all -- --network bsc
```

## 部署命令

### 部署所有合约

```bash
# 部署 ERC20、ERC721 和 ERC1155
npm run deploy:all -- --network <network-name>

# 或使用 --all 参数
npx hardhat run scripts/deploy-all.js --network <network-name> -- --all
```

### 选择性部署

```bash
# 只部署 ERC20
npm run deploy:all -- --network <network-name> -- --erc20

# 只部署 ERC721
npm run deploy:all -- --network <network-name> -- --erc721

# 只部署 ERC1155
npm run deploy:all -- --network <network-name> -- --erc1155

# 部署 ERC20 和 ERC721
npm run deploy:all -- --network <network-name> -- --erc20 --erc721
```

### 单独部署脚本

```bash
# ERC20
npm run deploy:erc20 -- --network <network-name>

# ERC721
npm run deploy:erc721 -- --network <network-name>

# ERC1155
npm run deploy:erc1155 -- --network <network-name>
```

## 合约验证

部署脚本会自动尝试验证合约。如果自动验证失败，可以手动验证：

```bash
npx hardhat verify --network <network-name> <contract-address> <constructor-args>
```

### 示例

```bash
# 验证 ERC20
npx hardhat verify --network sepolia 0x123... "MyToken" "MTK" "1000000" "18"

# 验证 ERC721
npx hardhat verify --network sepolia 0x456... "MyNFT" "MNFT" "https://api.example.com/metadata/"

# 验证 ERC1155
npx hardhat verify --network sepolia 0x789... "MyMultiToken" "MMT" "https://api.example.com/metadata/{id}.json"
```

## 批量转账功能

### ERC20 批量转账

```solidity
// 向多个地址转账
function batchTransfer(
    address[] memory recipients,
    uint256[] memory amounts
) public returns (bool)
```

### ERC721 批量转账

```solidity
// 批量转移 NFT 到同一地址
function batchTransfer(
    address to,
    uint256[] memory tokenIds
) public

// 批量转移 NFT 到不同地址
function batchTransferMultiple(
    address[] memory recipients,
    uint256[] memory tokenIds
) public
```

### ERC1155 批量转账

ERC1155 原生支持批量操作：

```solidity
// 使用标准的 safeBatchTransferFrom
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) public
```

## 常见问题

### 1. 部署失败：insufficient funds

**问题**: 账户余额不足以支付 gas 费用。

**解决方案**: 
- 确保部署账户有足够的原生代币（ETH、MATIC、BNB 等）
- 测试网可以从水龙头获取测试币

### 2. 验证失败：Already Verified

**问题**: 合约已经在区块浏览器上验证过。

**解决方案**: 这不是错误，合约已经可以在区块浏览器上查看。

### 3. 网络连接错误

**问题**: RPC URL 无法连接。

**解决方案**:
- 检查 `.env` 文件中的 RPC URL 是否正确
- 使用可靠的 RPC 提供商（Alchemy、Infura、QuickNode）
- 检查网络连接

### 4. 私钥格式错误

**问题**: 私钥格式不正确。

**解决方案**:
- 私钥应该是 64 个十六进制字符
- 不要包含 `0x` 前缀
- 确保没有多余的空格

### 5. Gas 估算失败

**问题**: 交易 gas 估算失败。

**解决方案**:
- 检查构造函数参数是否正确
- 确保合约代码没有错误
- 在本地网络先测试

## 网络 Gas 费参考

| 网络 | 平均 Gas 费 | 获取测试币 |
|------|------------|-----------|
| Ethereum | 高 | [Sepolia Faucet](https://sepoliafaucet.com/) |
| Polygon | 低 | [Mumbai Faucet](https://faucet.polygon.technology/) |
| BSC | 低 | [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart) |
| Arbitrum | 很低 | [Arbitrum Faucet](https://faucet.quicknode.com/arbitrum/sepolia) |
| Optimism | 很低 | [Optimism Faucet](https://app.optimism.io/faucet) |
| Base | 很低 | [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet) |

## 技术支持

如有问题，请检查：
1. Hardhat 文档: https://hardhat.org/
2. OpenZeppelin 文档: https://docs.openzeppelin.com/
3. 各网络的官方文档

## 安全建议

- ✅ 始终在测试网先部署和测试
- ✅ 使用硬件钱包管理主网私钥
- ✅ 定期审计智能合约代码
- ✅ 实施多签钱包管理重要合约
- ❌ 不要在代码中硬编码私钥
- ❌ 不要将 `.env` 文件提交到版本控制
