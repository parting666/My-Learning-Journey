const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("开始部署 TokenFactory 工厂合约...");
    console.log(`网络: ${hre.network.name}`);
    console.log("=".repeat(60));

    // 获取合约工厂
    const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");

    // 部署合约
    console.log("\n正在部署合约...");
    const factory = await TokenFactory.deploy();

    await factory.waitForDeployment();

    const address = await factory.getAddress();

    console.log("\n✅ TokenFactory 工厂合约部署成功!");
    console.log("=".repeat(60));
    console.log(`合约地址: ${address}`);
    console.log(`部署网络: ${hre.network.name}`);
    console.log(`交易哈希: ${factory.deploymentTransaction().hash}`);
    console.log("=".repeat(60));

    // 等待几个区块确认后再验证
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\n等待区块确认...");
        await factory.deploymentTransaction().wait(5);

        console.log("\n开始验证合约...");
        try {
            await hre.run("verify:verify", {
                address: address,
                constructorArguments: [],
            });
            console.log("✅ 合约验证成功!");
        } catch (error) {
            if (error.message.includes("Already Verified")) {
                console.log("ℹ️  合约已经验证过了");
            } else {
                console.log("⚠️  合约验证失败:", error.message);
            }
        }
    }

    // 输出使用说明
    console.log("\n" + "=".repeat(60));
    console.log("使用说明");
    console.log("=".repeat(60));
    console.log("\n通过工厂合约部署代币:");
    console.log("\n1. 部署 ERC20 代币:");
    console.log('   factory.deployERC20("TokenName", "SYMBOL", 1000000, 18)');
    console.log("\n2. 部署 ERC721 NFT:");
    console.log('   factory.deployERC721("NFTName", "SYMBOL", "https://api.example.com/")');
    console.log("\n3. 部署 ERC1155 多代币:");
    console.log('   factory.deployERC1155("MultiToken", "SYMBOL", "https://api.example.com/{id}.json")');
    console.log("\n查询功能:");
    console.log("   - getUserDeployments(address) - 查询用户部署的所有代币");
    console.log("   - getAllERC20Tokens() - 查询所有 ERC20 代币");
    console.log("   - getAllERC721Tokens() - 查询所有 ERC721 代币");
    console.log("   - getAllERC1155Tokens() - 查询所有 ERC1155 代币");
    console.log("   - getTotalDeployments() - 查询总部署数量");
    console.log("=".repeat(60));

    // 保存部署信息
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: address,
        deploymentTime: new Date().toISOString(),
        transactionHash: factory.deploymentTransaction().hash,
        chainId: hre.network.config.chainId
    };

    console.log("\n部署信息:", JSON.stringify(deploymentInfo, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
