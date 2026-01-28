const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("开始部署 ERC1155 多代币合约...");

    // 从环境变量读取部署参数
    const name = process.env.ERC1155_NAME || "MyMultiToken";
    const symbol = process.env.ERC1155_SYMBOL || "MMT";
    const baseURI = process.env.ERC1155_BASE_URI || "https://api.example.com/metadata/{id}.json";

    console.log("部署参数:");
    console.log(`  名称: ${name}`);
    console.log(`  符号: ${symbol}`);
    console.log(`  基础URI: ${baseURI}`);
    console.log(`  网络: ${hre.network.name}`);

    // 获取合约工厂
    const MyERC1155Token = await hre.ethers.getContractFactory("MyERC1155Token");

    // 部署合约
    const token = await MyERC1155Token.deploy(name, symbol, baseURI);

    await token.waitForDeployment();

    const address = await token.getAddress();

    console.log("\n✅ ERC1155 多代币合约部署成功!");
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
                constructorArguments: [name, symbol, baseURI],
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
        baseURI: baseURI,
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
