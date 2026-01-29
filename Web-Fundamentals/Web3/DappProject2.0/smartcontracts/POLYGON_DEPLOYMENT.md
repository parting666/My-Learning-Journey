# Polygon 测试网部署指南

## 📋 部署前准备

### 1. 获取测试 MATIC

您需要在 Polygon Amoy 测试网上有一些测试 MATIC 来支付 gas 费用。

#### 方法 1: Polygon Faucet (推荐)
访问官方水龙头获取测试 MATIC：
- **Polygon Faucet**: https://faucet.polygon.technology/
- 选择 **Polygon Amoy** 网络
- 输入您的钱包地址（从私钥推导的地址）
- 点击 "Submit" 获取测试 MATIC

#### 方法 2: Alchemy Faucet
- **Alchemy Faucet**: https://www.alchemy.com/faucets/polygon-amoy
- 需要 Alchemy 账户
- 每天可以获取一定数量的测试 MATIC

#### 方法 3: QuickNode Faucet
- **QuickNode**: https://faucet.quicknode.com/polygon/amoy
- 无需注册
- 快速获取测试代币

### 2. 查看您的部署者地址

运行以下命令查看您的钱包地址（这是将接收 KAIXIN 代币的地址）：

```bash
npx hardhat console
```

在控制台中输入：
```javascript
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
console.log("您的地址:", wallet.address);
.exit
```

**重要**: 复制这个地址，您需要用它从水龙头获取测试 MATIC。

### 3. 验证余额

在获取测试 MATIC 后，验证余额：

```bash
npx hardhat console --network amoy
```

在控制台中：
```javascript
const [deployer] = await ethers.getSigners();
const balance = await ethers.provider.getBalance(deployer.address);
console.log("地址:", deployer.address);
console.log("余额:", ethers.formatEther(balance), "MATIC");
.exit
```

确保余额 > 0.1 MATIC（足够部署合约）。

---

## 🚀 部署步骤

### 步骤 1: 编译合约

```bash
npm run compile
```

预期输出：
```
Compiled 1 Solidity file successfully
```

### 步骤 2: 部署到 Polygon Amoy 测试网

```bash
npm run deploy:erc20 -- --network amoy
```

**部署过程说明**：
1. 合约将使用 `.env` 文件中的参数部署
2. 初始供应量将铸造到您的地址
3. 脚本会自动尝试在 PolygonScan 上验证合约

### 步骤 3: 保存部署信息

部署成功后，您会看到类似输出：

```
✅ ERC20 代币合约部署成功!
  合约地址: 0x1234567890abcdef1234567890abcdef12345678
  部署者: 0xYourAddress...
  交易哈希: 0xabcdef...
```

**重要**: 保存这些信息！特别是：
- ✅ **合约地址** - 用于在钱包中添加代币
- ✅ **交易哈希** - 用于在区块浏览器上查看交易

---

## 🔍 验证部署

### 方法 1: 使用检查脚本

```bash
npx hardhat run scripts/check-balance.js --network amoy <合约地址>
```

替换 `<合约地址>` 为您部署的合约地址。

预期输出：
```
📊 代币信息:
  名称: KAIXIN
  符号: KX
  精度: 18
  总供应量: 1000000 KX
  合约所有者: 0xYourAddress...

💰 账户余额:
  地址: 0xYourAddress...
  余额: 1000000 KX

✅ 余额正常!
```

### 方法 2: 在 PolygonScan 上查看

访问 Polygon Amoy 测试网浏览器：
- **URL**: https://amoy.polygonscan.com/
- 搜索您的合约地址
- 查看合约详情和交易历史

---

## 💼 在钱包中添加代币

### MetaMask 配置

#### 1. 添加 Polygon Amoy 测试网

如果您的 MetaMask 中还没有 Polygon Amoy 网络：

1. 打开 MetaMask
2. 点击网络下拉菜单
3. 点击 "添加网络"
4. 点击 "手动添加网络"
5. 输入以下信息：

```
网络名称: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology
Chain ID: 80002
货币符号: MATIC
区块浏览器: https://amoy.polygonscan.com
```

6. 点击 "保存"

#### 2. 导入 KAIXIN 代币

1. 在 MetaMask 中切换到 **Polygon Amoy Testnet**
2. 确保您使用的账户地址与部署合约的地址一致
3. 点击 "导入代币" (Import tokens)
4. 选择 "自定义代币" (Custom token)
5. 输入：
   - **代币合约地址**: 您部署的合约地址
   - **代币符号**: KX (自动填充)
   - **代币精度**: 18 (自动填充)
6. 点击 "添加自定义代币"
7. 点击 "导入代币"

您应该立即看到 **1,000,000 KX** 在您的钱包中！

---

## 🧪 测试代币功能

### 测试转账

创建一个测试脚本来转账代币：

```bash
npx hardhat console --network amoy
```

在控制台中：
```javascript
// 获取合约实例
const token = await ethers.getContractAt("MyERC20Token", "<合约地址>");

// 转账 100 KX 到另一个地址
const recipient = "0x接收者地址...";
const amount = ethers.parseUnits("100", 18);
const tx = await token.transfer(recipient, amount);
await tx.wait();

console.log("转账成功!");

// 检查余额
const balance = await token.balanceOf(recipient);
console.log("接收者余额:", ethers.formatUnits(balance, 18), "KX");
```

### 测试铸造功能（仅所有者）

```javascript
// 铸造 1000 个新代币
const mintAmount = ethers.parseUnits("1000", 18);
const mintTx = await token.mint(deployer.address, mintAmount);
await mintTx.wait();

console.log("铸造成功!");

// 检查新余额
const newBalance = await token.balanceOf(deployer.address);
console.log("新余额:", ethers.formatUnits(newBalance, 18), "KX");
```

### 测试批量转账

```javascript
// 批量转账到多个地址
const recipients = [
  "0x地址1...",
  "0x地址2...",
  "0x地址3..."
];

const amounts = [
  ethers.parseUnits("10", 18),
  ethers.parseUnits("20", 18),
  ethers.parseUnits("30", 18)
];

const batchTx = await token.batchTransfer(recipients, amounts);
await batchTx.wait();

console.log("批量转账成功!");
```

---

## 📊 部署参数说明

当前配置（来自 `.env` 文件）：

```env
ERC20_NAME=KAIXIN          # 代币名称
ERC20_SYMBOL=KX            # 代币符号
ERC20_INITIAL_SUPPLY=1000000  # 初始供应量（不含精度）
ERC20_DECIMALS=18          # 代币精度
```

**实际铸造数量**: 1,000,000 × 10^18 = 1,000,000.000000000000000000 KX

---

## ❓ 常见问题

### Q1: 部署失败 - "insufficient funds"

**原因**: 账户中没有足够的测试 MATIC。

**解决方案**:
1. 从水龙头获取测试 MATIC
2. 确认您获取的是 **Amoy** 测试网的 MATIC（不是 Mumbai）
3. 等待几分钟让交易确认

### Q2: 钱包中看不到代币

**原因**: 可能的几个原因。

**解决方案**:
1. ✅ 确认您在 MetaMask 中切换到了 **Polygon Amoy Testnet**
2. ✅ 确认您使用的账户地址与部署合约的地址一致
3. ✅ 确认您已经在 MetaMask 中添加了代币合约地址
4. ✅ 运行检查脚本验证链上余额

### Q3: 合约验证失败

**原因**: PolygonScan API 可能需要一些时间。

**解决方案**:
```bash
# 手动验证合约
npx hardhat verify --network amoy <合约地址> "KAIXIN" "KX" "1000000" "18"
```

### Q4: 如何查看我的部署者地址？

```bash
npx hardhat console
```

```javascript
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
console.log(wallet.address);
```

### Q5: Mumbai 测试网还能用吗？

**不推荐**。Mumbai 测试网已被弃用，Polygon 官方推荐使用 **Amoy 测试网**。

如果您仍想使用 Mumbai：
```bash
npm run deploy:erc20 -- --network mumbai
```

---

## 🔗 有用的链接

- **Polygon Amoy 浏览器**: https://amoy.polygonscan.com/
- **Polygon 水龙头**: https://faucet.polygon.technology/
- **Polygon 文档**: https://docs.polygon.technology/
- **Hardhat 文档**: https://hardhat.org/
- **OpenZeppelin 文档**: https://docs.openzeppelin.com/

---

## 📝 部署检查清单

在部署之前，确认：

- [ ] 已安装所有依赖 (`npm install`)
- [ ] `.env` 文件中有正确的私钥
- [ ] 已从水龙头获取测试 MATIC
- [ ] 账户余额 > 0.1 MATIC
- [ ] 已编译合约 (`npm run compile`)

部署后：

- [ ] 保存了合约地址
- [ ] 保存了交易哈希
- [ ] 在 PolygonScan 上验证了合约
- [ ] 在 MetaMask 中添加了代币
- [ ] 确认钱包中显示正确的代币余额
- [ ] 测试了基本的转账功能

---

## 🎉 下一步

部署成功后，您可以：

1. **测试代币功能** - 转账、铸造、销毁
2. **部署到主网** - 当您准备好时，部署到 Polygon 主网
3. **集成到前端** - 在您的 DApp 中使用这个代币
4. **部署其他合约** - ERC721 NFT 或 ERC1155 多代币

祝您部署顺利！🚀
