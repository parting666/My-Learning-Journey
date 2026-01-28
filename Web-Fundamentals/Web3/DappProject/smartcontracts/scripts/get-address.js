const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("=== 获取部署者地址 ===\n");

    // 从私钥创建钱包
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

    console.log("📍 您的部署者地址:");
    console.log(`   ${wallet.address}\n`);

    console.log("📋 下一步:");
    console.log("1. 复制上面的地址");
    console.log("2. 访问 Polygon 水龙头: https://faucet.polygon.technology/");
    console.log("3. 选择 'Polygon Amoy' 网络");
    console.log("4. 粘贴您的地址并获取测试 MATIC");
    console.log("5. 等待 1-2 分钟让交易确认\n");

    console.log("💡 提示: 您需要至少 0.1 MATIC 来部署合约");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
