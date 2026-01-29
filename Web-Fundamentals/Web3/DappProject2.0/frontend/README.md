# Antigravity - Token Factory (Vue 3 + TypeScript)

一个基于 Vue 3 + TypeScript + Ethers.js 构建的一站式区块链代币管理平台。支持 ERC20、ERC721 (NFT) 和 ERC1155 标准代币的快速部署、铸造、转账及资产管理。

## 🚀 主要功能

- **多标准支持**：支持 ERC20、ERC721、ERC1155 代币的完整生命周期管理。
- **工厂合约集成**：通过 `TokenFactory` 合约统一管理用户部署的所有代币，支持历史记录追踪。
- **资产概览**：实时查看钱包原生资产（ETH/MATIC）及 ERC20 代币余额。
- **批量操作**：支持 ERC721 和 ERC1155 的批量铸造（Batch Mint）功能。
- **本地化存储**：自动保存用户在本地部署的合约地址，方便快速管理。
- **响应式 UI**：基于 Tailwind CSS 构建，完美适配移动端和桌面端。

## 🏗 项目架构

```text
frontend/
├── src/
│   ├── artifacts/      # 智能合约 ABI 与 Bytecode 导出
│   ├── components/     # 功能组件（部署、管理、历史记录等）
│   ├── hooks/          # 核心逻辑（钱包连接、本地存储等）
│   ├── router/         # 路由配置
│   ├── utils/          # 工具函数（Alchemy 集成等）
│   ├── views/          # 页面视图（首页、资产管理、部署中心等）
│   ├── App.vue         # 入口组件
│   └── main.ts         # 项目入口
├── .env.example        # 环境变量模板
└── vite.config.ts      # Vite 配置文件
```

## 🛠 运行指南

### 1. 克隆并安装依赖
```bash
git clone <repository-url>
cd frontend
npm install
```

### 2. 配置环境变量
复制 `.env.example` 并重命名为 `.env`，填入你的 Alchemy API Key：
```bash
cp .env.example .env
```
编辑 `.env`：
```text
VITE_ALCHEMY_API_KEY=你的API_KEY
VITE_ALCHEMY_NETWORK=polygon-amoy
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 项目构建
```bash
npm run build
```

## ⚠️ 常见问题与解决方法

### 1. 钱包余额显示为 0 或报错 `TypeError: Receiver must be an instance of class anonymous`
- **原因**：Vue 3 的响应式 Proxy 干扰了 Ethers.js 的 Provider 实例，或者 RPC 请求超时。
- **解法**：项目已在 `useWallet.ts` 中统一了余额获取逻辑，直接操作原始 Provider。请确保网络连接正常并已切换到正确的链（如 Polygon Amoy）。

### 2. 报错 `Module "buffer" has been externalized`
- **原因**：Vite 在浏览器端默认不提供 Node.js 的 `Buffer` 模块。
- **解法**：已在 `index.html` 引入 Polyfill，并在 `vite.config.ts` 中定义了 `global` 变量。

### 3. 样式没有生效
- **原因**：Tailwind CSS 配置或 PostCSS 插件冲突。
- **解法**：确保已安装 `tailwindcss@v3` 及其相关依赖。项目已配置好 `postcss.config.cjs`。

### 4. 合约交互失败
- **原因**：钱包余额不足以支付 Gas 费，或 ABI 与部署的合约不匹配。
- **解法**：请领取测试网代币（Faucet），并检查 `src/artifacts` 下的合约定义。

## 📄 许可

MIT License
