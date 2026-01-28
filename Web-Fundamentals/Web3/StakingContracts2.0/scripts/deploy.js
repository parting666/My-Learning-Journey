const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting multi-chain deployment...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId.toString();
    console.log(`Network: ${hre.network.name} (Chain ID: ${chainId})`);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

    // Deploy Staking Token (for testing)
    console.log("📝 Deploying StakingToken...");
    const StakingToken = await hre.ethers.getContractFactory("StakingToken");
    const stakingToken = await StakingToken.deploy("Party Token", "PT", 1000000);
    await stakingToken.waitForDeployment();
    const stakingTokenAddress = await stakingToken.getAddress();
    console.log("✅ StakingToken deployed to:", stakingTokenAddress);

    // Deploy Rewards Token
    console.log("📝 Deploying RewardsToken...");
    const RewardsToken = await hre.ethers.getContractFactory("StakingToken");
    const rewardsToken = await RewardsToken.deploy("Party Rewards Token", "PRT", 10000000);
    await rewardsToken.waitForDeployment();
    const rewardsTokenAddress = await rewardsToken.getAddress();
    console.log("✅ RewardsToken deployed to:", rewardsTokenAddress);

    // Deploy Test ERC721
    console.log("📝 Deploying TestERC721...");
    const TestERC721 = await hre.ethers.getContractFactory("TestERC721");
    const testERC721 = await TestERC721.deploy();
    await testERC721.waitForDeployment();
    const testERC721Address = await testERC721.getAddress();
    console.log("✅ TestERC721 deployed to:", testERC721Address);

    // Mint some NFTs for testing (e.g., 10)
    console.log("📝 Minting 10 test NFTs...");
    await (await testERC721.batchMint(deployer.address, 10)).wait();
    console.log("✅ 10 test NFTs minted to:", deployer.address);

    // Deploy Test ERC1155
    console.log("📝 Deploying TestERC1155...");
    const TestERC1155 = await hre.ethers.getContractFactory("TestERC1155");
    const testERC1155 = await TestERC1155.deploy();
    await testERC1155.waitForDeployment();
    const testERC1155Address = await testERC1155.getAddress();
    console.log("✅ TestERC1155 deployed to:", testERC1155Address);
    console.log("✅ 100,000 test 1155 tokens minted to:", deployer.address);

    // Deploy Staking Factory
    console.log("📝 Deploying StakingFactory...");
    const StakingFactory = await hre.ethers.getContractFactory("StakingFactory");
    const stakingFactory = await StakingFactory.deploy();
    await stakingFactory.waitForDeployment();
    const stakingFactoryAddress = await stakingFactory.getAddress();
    console.log("✅ StakingFactory deployed to:", stakingFactoryAddress);

    // Create a default ERC20 pool
    console.log("📝 Creating default ERC20 pool...");
    const createTx = await stakingFactory.createStakingPool(stakingTokenAddress, rewardsTokenAddress, hre.ethers.parseEther("0.1"));
    const receipt = await createTx.wait();

    // Find pool address from event
    const event = receipt.logs.find(log => {
        try {
            return stakingFactory.interface.parseLog(log).name === 'StakingPoolCreated';
        } catch (e) {
            return false;
        }
    });

    let defaultPool = "";
    if (event) {
        defaultPool = stakingFactory.interface.parseLog(event).args.stakingContract;
        console.log("✅ Default ERC20 pool created at:", defaultPool);
    }

    // Create a default ERC721 pool
    console.log("📝 Creating default ERC721 pool...");
    const create721Tx = await stakingFactory.createERC721StakingPool(testERC721Address, rewardsTokenAddress, hre.ethers.parseEther("0.1"));
    const receipt721 = await create721Tx.wait();
    const event721 = receipt721.logs.find(log => {
        try { return stakingFactory.interface.parseLog(log).name === 'StakingPoolCreated'; } catch (e) { return false; }
    });
    let default721Pool = event721 ? stakingFactory.interface.parseLog(event721).args.stakingContract : "";
    if (default721Pool) console.log("✅ Default ERC721 pool created at:", default721Pool);

    // Create a default ERC1155 pool
    console.log("📝 Creating default ERC1155 pool...");
    const create1155Tx = await stakingFactory.createERC1155StakingPool(testERC1155Address, rewardsTokenAddress, hre.ethers.parseEther("0.1"));
    const receipt1155 = await create1155Tx.wait();
    const event1155 = receipt1155.logs.find(log => {
        try { return stakingFactory.interface.parseLog(log).name === 'StakingPoolCreated'; } catch (e) { return false; }
    });
    let default1155Pool = event1155 ? stakingFactory.interface.parseLog(event1155).args.stakingContract : "";
    if (default1155Pool) console.log("✅ Default ERC1155 pool created at:", default1155Pool);

    // Load existing networks.json if it exists
    const configDir = path.join(__dirname, "../frontend/src/config");
    const networksPath = path.join(configDir, "networks.json");
    let networks = {};
    if (fs.existsSync(networksPath)) {
        networks = JSON.parse(fs.readFileSync(networksPath, "utf8"));
    }

    // Update current network info
    networks[chainId] = {
        name: hre.network.name,
        stakingFactory: stakingFactoryAddress,
        stakingToken: stakingTokenAddress,
        rewardsToken: rewardsTokenAddress,
        testERC721: testERC721Address,
        testERC1155: testERC1155Address,
        defaultPool: defaultPool,
        default721Pool: default721Pool,
        default1155Pool: default1155Pool,
        lastUpdated: new Date().toISOString()
    };

    // Ensure directory exists
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    // Save networks info
    fs.writeFileSync(networksPath, JSON.stringify(networks, null, 2));
    console.log(`\n📄 Network info saved to ${networksPath}`);

    // Update ABIs
    const artifactsDir = path.join(__dirname, "../artifacts/contracts");
    const abis = {
        StakingToken: require(path.join(artifactsDir, "StakingToken.sol/StakingToken.json")).abi,
        StakingRewards: require(path.join(artifactsDir, "StakingRewards.sol/StakingRewards.json")).abi,
        ERC721StakingRewards: require(path.join(artifactsDir, "ERC721StakingRewards.sol/ERC721StakingRewards.json")).abi,
        ERC1155StakingRewards: require(path.join(artifactsDir, "ERC1155StakingRewards.sol/ERC1155StakingRewards.json")).abi,
        StakingFactory: require(path.join(artifactsDir, "StakingFactory.sol/StakingFactory.json")).abi,
        TestERC721: require(path.join(artifactsDir, "TestERC721.sol/TestERC721.json")).abi,
        TestERC1155: require(path.join(artifactsDir, "TestERC1155.sol/TestERC1155.json")).abi
    };

    fs.writeFileSync(
        path.join(configDir, "abis.json"),
        JSON.stringify(abis, null, 2)
    );
    console.log("📄 ABIs updated in abis.json");

    console.log("\n🎉 Deployment completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
