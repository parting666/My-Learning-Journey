# DApp Project (React + TailwindCSS + wagmi + viem + RainbowKit)

## 目录结构
- `src/lib/wagmi.ts`: wagmi 与 RainbowKit 配置，多链支持
- `src/components/Layout/Header.tsx`: 顶部导航与连接按钮
- `src/modules/assets`: 资产获取（原生与 ERC-20）
- `src/modules/transfers`: 发送/转账（原生与 ERC-20）
- `src/modules/approvals`: ERC-20 批准
- `src/modules/signing`: 消息签名与 EIP-712 TypedData
- `src/modules/network`: 多链切换
- `src/__tests__`: 基础测试

## 依赖列表（关键库）
- 前端: `react`, `react-dom`, `vite`, `typescript`
- 样式: `tailwindcss`, `postcss`, `autoprefixer`
- Web3: `wagmi`, `viem`, `@rainbow-me/rainbowkit`, `@tanstack/react-query`
- 测试: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## 环境变量
- `VITE_WALLETCONNECT_PROJECT_ID`: RainbowKit/WalletConnect 项目 ID（用于 WalletConnect 连接器）

## 核心模块设计与关键流程
- 获取资产
  - 原生资产: `useBalance({ address })`
  - ERC-20 资产: `useReadContract` 读取 `decimals / symbol / balanceOf`
- 发送/转账
  - 原生: `useSendTransaction().sendTransaction({ to, value })`
  - ERC-20: `useWriteContract({ abi: erc20Abi, functionName: 'transfer', args })`
- 批准/签名
  - 批准: `approve(spender, amount)` via `writeContract`
  - 普通信签名: `useSignMessage({ message })`
  - EIP-712: `useSignTypedData({ domain, types, primaryType, message })`
- 多链切换
  - 使用 `useSwitchChain` 与预置 `supportedChains`

## 安全建议
- 资产/交易前端输入校验（地址校验、正数金额、最小/最大限制）
- 对 ERC-20 `decimals` 不同的情况进行转换，避免硬编码 18 位
- 交易前显示确认信息与潜在风险提醒（链ID、目标地址、金额）
- 避免在前端保存私钥；使用钱包连接与签名，所有敏感操作交由钱包完成
- 针对 `approve` 建议使用最小授权额，不使用无限授权
- 针对跨链与测试网，明确区分并展示网络标识

## 测试建议
- 单元测试：
  - UI 冒烟（组件渲染）
  - 表单校验逻辑与数值转换函数
- 集成测试：
  - 模拟 wagmi hooks，验证执行路径（例如点击按钮触发 sendTransaction）
- 端到端（可选）：
  - 使用 Playwright/Cypress，配合一个本地链（如 Anvil/Hardhat）

## 部署与 CI 要点

### 快速部署到 Vercel

本项目已配置完整的 Vercel 部署支持。

**一键部署:**
```bash
npm install -g vercel
vercel login
vercel
```

**配置环境变量:**
```bash
vercel env add VITE_WALLETCONNECT_PROJECT_ID
vercel env add VITE_ALCHEMY_API_KEY
```

**生产部署:**
```bash
vercel --prod
```

📖 **详细部署指南**: 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的部署文档,包括:
- Vercel CLI 和 Dashboard 部署方法
- 环境变量配置
- 自定义域名设置
- 故障排查
- 性能优化建议

### 构建配置
- 构建命令: `npm run build` 产出 `dist` 目录
- 框架: Vite
- 输出目录: `dist`
- Node 版本: 20+

### 环境变量
在 Vercel Dashboard 或通过 CLI 配置:
- `VITE_WALLETCONNECT_PROJECT_ID` (必需): WalletConnect Project ID
- `VITE_ALCHEMY_API_KEY` (推荐): Alchemy API Key,用于查询资产和 NFT

### GitHub Actions CI/CD
项目已配置自动化流程:
- 类型检查 (`npm run typecheck`)
- 单元测试 (`npm run test`)
- 构建验证 (`npm run build`)
- 缓存 npm 依赖以加速构建

## 本地启动
```bash
npm install
echo "VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID" > .env.local
npm run dev
```

## 后续增强
- Token 列表与多链预设（使用 Token 清单服务或自维护列表）
- Gas 估算与自定义设置
- 交易历史与通知（监听 `watchBlocks` / `watchContractEvent`）