const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("=== 检查 KAIXIN 代币余额 ===\n");

    // 获取部署者账户
    const [deployer] = await hre.ethers.getSigners();
    console.log(`部署者地址: ${deployer.address}`);
    console.log(`网络: ${hre.network.name}\n`);

    // 请在这里输入您部署的合约地址
    const contractAddress = process.argv[2];

    if (!contractAddress) {
        console.log("❌ 请提供合约地址!");
        console.log("使用方法: npx hardhat run scripts/check-balance.js --network <network> <contract-address>");
        console.log("示例: npx hardhat run scripts/check-balance.js --network localhost 0x5FbDB2315678afecb367f032d93F642f64180aa3");
        process.exit(1);
    }

    try {
        // 获取合约实例
        const token = await hre.ethers.getContractAt("MyERC20Token", contractAddress);

        // 获取代币信息
        const name = await token.name();
        const symbol = await token.symbol();
        const decimals = await token.decimals();
        const totalSupply = await token.totalSupply();
        const owner = await token.owner();

        console.log("📊 代币信息:");
        console.log(`  名称: ${name}`);
        console.log(`  符号: ${symbol}`);
        console.log(`  精度: ${decimals}`);
        console.log(`  总供应量: ${hre.ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
        console.log(`  合约所有者: ${owner}\n`);

        // 检查部署者余额
        const deployerBalance = await token.balanceOf(deployer.address);
        console.log("💰 账户余额:");
        console.log(`  地址: ${deployer.address}`);
        console.log(`  余额: ${hre.ethers.formatUnits(deployerBalance, decimals)} ${symbol}`);
        console.log(`  原始余额: ${deployerBalance.toString()}\n`);

        // 检查是否部署者就是所有者
        if (deployer.address.toLowerCase() === owner.toLowerCase()) {
            console.log("✅ 您的地址是合约所有者");
        } else {
            console.log("⚠️  您的地址不是合约所有者");
            console.log(`   合约所有者是: ${owner}`);
        }

        // 如果余额为0，检查可能的原因
        if (deployerBalance.toString() === "0") {
            console.log("\n❌ 余额为 0 的可能原因:");
            console.log("1. 这不是部署合约的账户");
            console.log("2. 代币已经被转移到其他地址");
            console.log("3. 您在错误的网络上查看");
            console.log("4. 合约地址不正确\n");

            console.log("💡 建议:");
            console.log("- 确认您使用的是部署合约时的账户");
            console.log("- 确认您在正确的网络上（localhost/sepolia/等）");
            console.log("- 检查部署日志中的合约地址");
        } else {
            console.log("\n✅ 余额正常!");
        }

    } catch (error) {
        console.log("\n❌ 错误:", error.message);
        console.log("\n可能的原因:");
        console.log("- 合约地址不正确");
        console.log("- 网络不匹配");
        console.log("- 合约未部署在此网络");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
