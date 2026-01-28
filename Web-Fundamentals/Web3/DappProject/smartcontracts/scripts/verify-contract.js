const hre = require("hardhat");

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log("使用方法: npx hardhat run scripts/verify-contract.js --network <network> <contract-address> <constructor-args...>");
        console.log("示例: npx hardhat run scripts/verify-contract.js --network sepolia 0x123... MyToken MTK 1000000 18");
        process.exit(1);
    }

    const contractAddress = args[0];
    const constructorArgs = args.slice(1);

    console.log("开始验证合约...");
    console.log(`合约地址: ${contractAddress}`);
    console.log(`构造函数参数: ${constructorArgs.join(", ")}`);
    console.log(`网络: ${hre.network.name}`);

    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArgs,
        });
        console.log("✅ 合约验证成功!");
    } catch (error) {
        if (error.message.includes("Already Verified")) {
            console.log("ℹ️  合约已经验证过了");
        } else {
            console.error("❌ 验证失败:", error.message);
            process.exit(1);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
