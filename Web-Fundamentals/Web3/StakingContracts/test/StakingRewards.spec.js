const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingRewards", function () {
  let deployer, user;
  let stakingToken, rewardsToken, stakingRewards;

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();

    const StakingToken = await ethers.getContractFactory("StakingToken");
    stakingToken = await StakingToken.deploy("Party Token", "PT", 1_000_000);
    await stakingToken.waitForDeployment();

    const RewardsToken = await ethers.getContractFactory("StakingToken");
    rewardsToken = await RewardsToken.deploy("Party Rewards Token", "PRD", 10_000_000);
    await rewardsToken.waitForDeployment();

    const rewardRate = ethers.parseEther("0.0001");
    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    stakingRewards = await StakingRewards.deploy(
      await stakingToken.getAddress(),
      await rewardsToken.getAddress(),
      rewardRate
    );
    await stakingRewards.waitForDeployment();

    // Seed rewards
    await rewardsToken.transfer(await stakingRewards.getAddress(), ethers.parseEther("1000000"));

    // Give user some staking tokens
    await stakingToken.transfer(user.address, ethers.parseEther("1000"));
  });

  it("fails stake when allowance is insufficient", async () => {
    const amount = ethers.parseEther("10");
    await expect(stakingRewards.connect(user).stake(amount)).to.be.revertedWith("Insufficient allowance");
  });

  it("fails stake when balance is insufficient", async () => {
    const bigAmount = ethers.parseEther("100000"); // larger than user balance
    // Approve large allowance first
    await stakingToken.connect(user).approve(await stakingRewards.getAddress(), bigAmount);
    await expect(stakingRewards.connect(user).stake(bigAmount)).to.be.revertedWith("Insufficient balance");
  });

  it("stakes successfully after approve", async () => {
    const amount = ethers.parseEther("100");
    await stakingToken.connect(user).approve(await stakingRewards.getAddress(), amount);
    const tx = await stakingRewards.connect(user).stake(amount);
    await tx.wait();

    const staked = await stakingRewards.stakedBalance(user.address);
    const totalStaked = await stakingRewards.totalStaked();
    expect(staked).to.equal(amount);
    expect(totalStaked).to.equal(amount);

    const status = await stakingRewards.getAccountStatus(user.address);
    expect(status.balance).to.equal(ethers.parseEther("900")); // 1000 - 100 staked
    expect(status.staked).to.equal(amount);
  });
});
