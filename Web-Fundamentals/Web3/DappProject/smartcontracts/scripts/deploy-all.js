const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const args = process.argv.slice(2);

    // 解析命令行参数
    const deployERC20 = args.includes("--erc20") || args.includes("--all");
    const deployERC721 = args.includes("--erc721") || args.includes("--all");
    const deployERC1155 = args.includes("--erc1155") || args.includes("--all");

    // 如果没有指定任何参数，默认部署所有合约
    const deployAll = !deployERC20 && !deployERC721 && !deployERC1155;

    console.log("=".repeat(60));
    console.log("多链智能合约部署工具");
    console.log("=".repeat(60));
    console.log(`网络: ${hre.network.name}`);
    console.log(`Chain ID: ${hre.network.config.chainId}`);
    console.log("=".repeat(60));

    const deployments = [];

    // 部署 ERC20
    if (deployERC20 || deployAll) {
        console.log("\n📦 开始部署 ERC20 代币合约...");
        try {
            const erc20Address = await deployERC20Token();
            deployments.push({
                type: "ERC20",
                address: erc20Address,
                name: process.env.ERC20_NAME || "MyToken"
            });
            console.log("✅ ERC20 部署成功!");
        } catch (error) {
            console.error("❌ ERC20 部署失败:", error.message);
        }
    }

    // 部署 ERC721
    if (deployERC721 || deployAll) {
        console.log("\n📦 开始部署 ERC721 NFT 合约...");
        try {
            const erc721Address = await deployERC721NFT();
            deployments.push({
                type: "ERC721",
                address: erc721Address,
                name: process.env.ERC721_NAME || "MyNFT"
            });
            console.log("✅ ERC721 部署成功!");
        } catch (error) {
            console.error("❌ ERC721 部署失败:", error.message);
        }
    }

    // 部署 ERC1155
    if (deployERC1155 || deployAll) {
        console.log("\n📦 开始部署 ERC1155 多代币合约...");
        try {
            const erc1155Address = await deployERC1155Token();
            deployments.push({
                type: "ERC1155",
                address: erc1155Address,
                name: process.env.ERC1155_NAME || "MyMultiToken"
            });
            console.log("✅ ERC1155 部署成功!");
        } catch (error) {
            console.error("❌ ERC1155 部署失败:", error.message);
        }
    }

    // 输出部署摘要
    console.log("\n" + "=".repeat(60));
    console.log("部署摘要");
    console.log("=".repeat(60));
    console.log(`网络: ${hre.network.name}`);
    console.log(`成功部署: ${deployments.length} 个合约\n`);

    deployments.forEach((deployment, index) => {
        console.log(`${index + 1}. ${deployment.type} - ${deployment.name}`);
        console.log(`   地址: ${deployment.address}\n`);
    });

    console.log("=".repeat(60));
}

async function deployERC20Token() {
    const name = process.env.ERC20_NAME || "MyToken";
    const symbol = process.env.ERC20_SYMBOL || "MTK";
    const initialSupply = process.env.ERC20_INITIAL_SUPPLY || "1000000";
    const decimals = process.env.ERC20_DECIMALS || "18";

    const MyERC20Token = await hre.ethers.getContractFactory("MyERC20Token");
    const token = await MyERC20Token.deploy(name, symbol, initialSupply, decimals);
    await token.waitForDeployment();

    const address = await token.getAddress();
    console.log(`   合约地址: ${address}`);

    // 等待确认后验证
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        await token.deploymentTransaction().wait(3);
        await verifyContract(address, [name, symbol, initialSupply, decimals]);
    }

    return address;
}

async function deployERC721NFT() {
    const name = process.env.ERC721_NAME || "MyNFT";
    const symbol = process.env.ERC721_SYMBOL || "MNFT";
    const baseURI = process.env.ERC721_BASE_URI || "https://api.example.com/metadata/";

    const MyERC721NFT = await hre.ethers.getContractFactory("MyERC721NFT");
    const nft = await MyERC721NFT.deploy(name, symbol, baseURI);
    await nft.waitForDeployment();

    const address = await nft.getAddress();
    console.log(`   合约地址: ${address}`);

    // 等待确认后验证
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        await nft.deploymentTransaction().wait(3);
        await verifyContract(address, [name, symbol, baseURI]);
    }

    return address;
}

async function deployERC1155Token() {
    const name = process.env.ERC1155_NAME || "MyMultiToken";
    const symbol = process.env.ERC1155_SYMBOL || "MMT";
    const baseURI = process.env.ERC1155_BASE_URI || "https://api.example.com/metadata/{id}.json";

    const MyERC1155Token = await hre.ethers.getContractFactory("MyERC1155Token");
    const token = await MyERC1155Token.deploy(name, symbol, baseURI);
    await token.waitForDeployment();

    const address = await token.getAddress();
    console.log(`   合约地址: ${address}`);

    // 等待确认后验证
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        await token.deploymentTransaction().wait(3);
        await verifyContract(address, [name, symbol, baseURI]);
    }

    return address;
}

async function verifyContract(address, constructorArguments) {
    console.log("   开始验证合约...");
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: constructorArguments,
        });
        console.log("   ✅ 合约验证成功!");
    } catch (error) {
        if (error.message.includes("Already Verified")) {
            console.log("   ℹ️  合约已经验证过了");
        } else {
            console.log("   ⚠️  合约验证失败:", error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
