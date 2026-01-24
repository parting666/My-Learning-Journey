# ERC1155 NFT Collection Framework

这是一个可复用、可配置的 ERC1155 NFT 项目框架，包含合约、测试、部署脚本、IPFS 批量上传脚本以及批量铸造脚本。

## 🌟 主要功能

*   **ERC1155 标准合约**: 基于 OpenZeppelin 实现，安全可靠。
*   **独立 Token URI**: 支持为每个 Token ID 设置独立的元数据 URI (IPFS)。
*   **批量操作**:
    *   **批量上传**: 自动将 `assets/images` 目录下的图片上传到 IPFS (Pinata)，并生成对应的 metadata json 文件。
    *   **批量铸造**: 根据上传生成的 metadata，自动铸造 NFT 并设置 Token URI。
*   **多网络支持**: 预配置了 Polygon Amoy, Base Sepolia, BSC Testnet 等测试网。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的配置信息：

```bash
cp .env.example .env
```

在 `.env` 文件中填入：
*   `SEPOLIA_RPC_URL`: 目标网络的 RPC URL。
*   `PRIVATE_KEY`: 部署合约的钱包私钥。
*   `PINATA_JWT`: 用于上传 IPFS 的 Pinata JWT Token。
*   `POLYGONSCAN_API_KEY`: (可选) 用于验证合约。

### 3. 准备资源

将你的 NFT 图片放入 `assets/images/` 目录。支持 `.png`, `.jpg`, `.jpeg`, `.gif`。
*   建议文件名以数字命名 (e.g., `1.png`, `2.png`) 以便对应 Token ID，或者脚本会自动按文件名顺序处理。

### 4. 部署合约

```bash
npx hardhat run scripts/deploy.js --network <network_name>
```
例如：`npx hardhat run scripts/deploy.js --network amoy`

### 5. 批量上传资源到 IPFS

此脚本会上传图片和生成的元数据到 Pinata IPFS。

```bash
node scripts/batchUpload.js
```

### 6. 批量铸造 NFT

此脚本会读取上传结果，并在合约中铸造 NFT 并设置 URI。

```bash
npx hardhat run scripts/batchMint.js --network <network_name>
```

## 🛠️ 常见问题与解决方法 (Troubleshooting)

### 1. `Error: deployments.json not found`
*   **原因**: 尚未部署合约，或者部署脚本未成功保存地址。
*   **解决**: 先运行 `scripts/deploy.js`。

### 2. `Error: Token URIs file not found`
*   **原因**: 尚未运行上传脚本。
*   **解决**: 运行 `node scripts/batchUpload.js` 生成元数据。

### 3. IPFS 上传失败
*   **原因**: Pinata JWT 无效或网络问题。
*   **解决**: 检查 `.env` 中的 `PINATA_JWT` 是否正确，并确保有足够的 Pinata 存储空间。

### 4. 铸造交易失败 (Gas 相关)
*   **原因**: 网络拥堵或 Gas 设置过低。
*   **解决**: 在 `hardhat.config.js` 中调整 Gas 设置，或确保钱包中有足够的测试币。

### 5. OpenSea 上不显示图片
*   **原因**: 元数据缓存延迟或格式错误。
*   **解决**:
    *   点击 OpenSea 页面右上角的 "Refresh Metadata" 按钮。
    *   检查 `assets/output` 生成的 JSON 文件格式是否符合 OpenSea 标准。
    *   确认合约中的 URI 是否正确设置为 `ipfs://<CID>`。

## 📂 目录结构

*   `contracts/`: Solidity 合约源码。
*   `scripts/`: 部署、上传、铸造脚本。
*   `assets/images/`: 存放原始图片资源。
*   `assets/output/`: 脚本自动生成的元数据文件 (不要手动修改)。
*   `test/`: 测试脚本。

## 📄 License

MIT
