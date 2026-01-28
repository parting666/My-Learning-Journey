const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const contractAddress = "0xeA9FfDeE094564aC23b9ad437966Bf0000225590";

    console.log("=== 验证 KAIXIN 代币部署 ===\n");
    console.log(`🌐 网络: ${hre.network.name}`);
    console.log(`📍 合约地址: ${contractAddress}\n`);

    try {
        const [deployer] = await hre.ethers.getSigners();
        console.log(`👤 部署者地址: ${deployer.address}\n`);

        // 获取合约实例
        const token = await hre.ethers.getContractAt("MyERC20Token", contractAddress);

        // 获取代币信息
        const name = await token.name();
        const symbol = await token.symbol();
        const decimals = await token.decimals();
        const totalSupply = await token.totalSupply();
        const owner = await token.owner();

        console.log("📊 代币信息:");
        console.log(`   名称: ${name}`);
        console.log(`   符号: ${symbol}`);
        console.log(`   精度: ${decimals}`);
        console.log(`   总供应量: ${hre.ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
        console.log(`   合约所有者: ${owner}\n`);

        // 检查部署者余额
        const deployerBalance = await token.balanceOf(deployer.address);
        console.log("💰 您的账户余额:");
        console.log(`   地址: ${deployer.address}`);
        console.log(`   余额: ${hre.ethers.formatUnits(deployerBalance, decimals)} ${symbol}\n`);

        if (deployerBalance.toString() === "0") {
            console.log("❌ 余额为 0！");
            console.log("\n可能原因:");
            console.log("- 您查看的账户不是部署合约的账户");
            console.log("- 代币已被转移到其他地址\n");
        } else {
            console.log("✅ 部署成功！代币已在您的账户中！\n");

            console.log("📋 下一步 - 在 MetaMask 中添加代币:");
            console.log("1. 打开 MetaMask");
            console.log("2. 切换到 'Polygon Amoy Testnet'");
            console.log("3. 点击 '导入代币'");
            console.log("4. 输入代币合约地址:");
            console.log(`   ${contractAddress}`);
            console.log("5. 代币符号和精度会自动填充");
            console.log("6. 点击 '添加自定义代币'\n");

            console.log("🔍 在区块浏览器上查看:");
            console.log(`   https://amoy.polygonscan.com/address/${contractAddress}\n`);
        }

    } catch (error) {
        console.log("❌ 错误:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
