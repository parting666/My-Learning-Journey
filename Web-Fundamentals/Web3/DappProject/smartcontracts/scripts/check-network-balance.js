const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const network = process.argv[2] || "amoy";

    console.log(`=== 检查 ${network} 网络余额 ===\n`);

    try {
        const [deployer] = await hre.ethers.getSigners();
        const balance = await hre.ethers.provider.getBalance(deployer.address);

        console.log("📍 地址:", deployer.address);
        console.log("🌐 网络:", hre.network.name);
        console.log("💰 余额:", hre.ethers.formatEther(balance), "MATIC\n");

        const minBalance = hre.ethers.parseEther("0.1");

        if (balance >= minBalance) {
            console.log("✅ 余额充足，可以部署合约!");
            console.log("\n🚀 运行以下命令部署:");
            console.log(`   npm run deploy:erc20 -- --network ${hre.network.name}\n`);
        } else {
            console.log("❌ 余额不足，需要获取测试 MATIC");
            console.log("\n📋 获取测试 MATIC:");
            console.log("1. 访问: https://faucet.polygon.technology/");
            console.log("2. 选择 'Polygon Amoy' 网络");
            console.log("3. 输入地址:", deployer.address);
            console.log("4. 点击 'Submit' 获取测试币");
            console.log("5. 等待 1-2 分钟后重新运行此脚本\n");
        }
    } catch (error) {
        console.log("❌ 错误:", error.message);
        console.log("\n可能的原因:");
        console.log("- 网络连接问题");
        console.log("- RPC URL 不可用");
        console.log("- 私钥配置错误\n");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
