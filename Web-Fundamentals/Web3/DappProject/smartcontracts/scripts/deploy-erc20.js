const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("开始部署 ERC20 代币合约...");

    // 从环境变量读取部署参数
    const name = process.env.ERC20_NAME || "MyToken";
    const symbol = process.env.ERC20_SYMBOL || "MTK";
    const initialSupply = process.env.ERC20_INITIAL_SUPPLY || "1000000";
    const decimals = process.env.ERC20_DECIMALS || "18";

    console.log("部署参数:");
    console.log(`  名称: ${name}`);
    console.log(`  符号: ${symbol}`);
    console.log(`  初始供应量: ${initialSupply}`);
    console.log(`  精度: ${decimals}`);
    console.log(`  网络: ${hre.network.name}`);

    // 获取合约工厂
    const MyERC20Token = await hre.ethers.getContractFactory("MyERC20Token");

    // 部署合约
    const token = await MyERC20Token.deploy(name, symbol, initialSupply, decimals);

    await token.waitForDeployment();

    const address = await token.getAddress();

    console.log("\n✅ ERC20 代币合约部署成功!");
    console.log(`  合约地址: ${address}`);
    console.log(`  部署者: ${await token.owner()}`);
    console.log(`  交易哈希: ${token.deploymentTransaction().hash}`);

    // 等待几个区块确认后再验证
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\n等待区块确认...");
        await token.deploymentTransaction().wait(5);

        console.log("\n开始验证合约...");
        try {
            await hre.run("verify:verify", {
                address: address,
                constructorArguments: [name, symbol, initialSupply, decimals],
            });
            console.log("✅ 合约验证成功!");
        } catch (error) {
            console.log("⚠️  合约验证失败:", error.message);
        }
    }

    // 保存部署信息
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: address,
        deployer: await token.owner(),
        name: name,
        symbol: symbol,
        initialSupply: initialSupply,
        decimals: decimals,
        deploymentTime: new Date().toISOString(),
        transactionHash: token.deploymentTransaction().hash
    };

    console.log("\n部署信息:", JSON.stringify(deploymentInfo, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
