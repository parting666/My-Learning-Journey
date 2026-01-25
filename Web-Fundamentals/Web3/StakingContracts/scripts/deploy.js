const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting deployment...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

    // Deploy Staking Token
    console.log("📝 Deploying StakingToken...");
    const StakingToken = await hre.ethers.getContractFactory("StakingToken");
    const stakingToken = await StakingToken.deploy(
        "Party Token",
        "PT",
        1000000 // 1 million initial supply
    );
    await stakingToken.waitForDeployment();
    const stakingTokenAddress = await stakingToken.getAddress();
    console.log("✅ StakingToken deployed to:", stakingTokenAddress, "\n");

    // Deploy Rewards Token
    console.log("📝 Deploying RewardsToken...");
    const RewardsToken = await hre.ethers.getContractFactory("StakingToken");
    const rewardsToken = await RewardsToken.deploy(
        "Party Rewards Token",
        "PRD",
        10000000 // 10 million initial supply
    );
    await rewardsToken.waitForDeployment();
    const rewardsTokenAddress = await rewardsToken.getAddress();
    console.log("✅ RewardsToken deployed to:", rewardsTokenAddress, "\n");

    // Deploy Staking Rewards Contract
    console.log("📝 Deploying StakingRewards...");
    const rewardRate = hre.ethers.parseEther("0.0001"); // 0.0001 tokens per second
    const StakingRewards = await hre.ethers.getContractFactory("StakingRewards");
    const stakingRewards = await StakingRewards.deploy(
        stakingTokenAddress,
        rewardsTokenAddress,
        rewardRate
    );
    await stakingRewards.waitForDeployment();
    const stakingRewardsAddress = await stakingRewards.getAddress();
    console.log("✅ StakingRewards deployed to:", stakingRewardsAddress, "\n");

    // Deploy Staking Factory
    console.log("📝 Deploying StakingFactory...");
    const StakingFactory = await hre.ethers.getContractFactory("StakingFactory");
    const stakingFactory = await StakingFactory.deploy();
    await stakingFactory.waitForDeployment();
    const stakingFactoryAddress = await stakingFactory.getAddress();
    console.log("✅ StakingFactory deployed to:", stakingFactoryAddress, "\n");

    // Transfer rewards tokens to staking contract
    console.log("📝 Transferring rewards tokens to StakingRewards contract...");
    const rewardAmount = hre.ethers.parseEther("1000000"); // 1 million tokens for rewards
    await rewardsToken.transfer(stakingRewardsAddress, rewardAmount);
    console.log("✅ Transferred", hre.ethers.formatEther(rewardAmount), "RWD tokens to StakingRewards\n");

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            StakingToken: {
                address: stakingTokenAddress,
                name: "Party Token",
                symbol: "PT"
            },
            RewardsToken: {
                address: rewardsTokenAddress,
                name: "Party Rewards Token",
                symbol: "PRT"
            },
            StakingRewards: {
                address: stakingRewardsAddress,
                rewardRate: rewardRate.toString()
            },
            StakingFactory: {
                address: stakingFactoryAddress
            }
        }
    };

    // Create frontend config directory if it doesn't exist
    const frontendConfigDir = path.join(__dirname, "../frontend/src/config");
    if (!fs.existsSync(frontendConfigDir)) {
        fs.mkdirSync(frontendConfigDir, { recursive: true });
    }

    // Save addresses
    fs.writeFileSync(
        path.join(frontendConfigDir, "contracts.json"),
        JSON.stringify(deploymentInfo, null, 2)
    );

    // Copy ABIs
    const artifactsDir = path.join(__dirname, "../artifacts/contracts");

    const stakingTokenABI = require(path.join(artifactsDir, "StakingToken.sol/StakingToken.json")).abi;
    const stakingRewardsABI = require(path.join(artifactsDir, "StakingRewards.sol/StakingRewards.json")).abi;
    const stakingFactoryABI = require(path.join(artifactsDir, "StakingFactory.sol/StakingFactory.json")).abi;

    fs.writeFileSync(
        path.join(frontendConfigDir, "abis.json"),
        JSON.stringify({
            StakingToken: stakingTokenABI,
            StakingRewards: stakingRewardsABI,
            StakingFactory: stakingFactoryABI
        }, null, 2)
    );

    console.log("📄 Deployment info saved to frontend/src/config/\n");
    console.log("=".repeat(60));
    console.log("🎉 Deployment completed successfully!");
    console.log("=".repeat(60));
    console.log("\n📋 Contract Addresses:");
    console.log("   StakingToken:   ", stakingTokenAddress);
    console.log("   RewardsToken:   ", rewardsTokenAddress);
    console.log("   StakingRewards: ", stakingRewardsAddress);
    console.log("   StakingFactory: ", stakingFactoryAddress);
    console.log("\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
