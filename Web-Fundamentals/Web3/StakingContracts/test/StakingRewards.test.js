const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("StakingRewards", function () {
    let stakingToken, rewardsToken, stakingRewards;
    let owner, user1, user2;
    const REWARD_RATE = ethers.parseEther("0.0001"); // 0.0001 tokens per second

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy tokens
        const StakingToken = await ethers.getContractFactory("StakingToken");
        stakingToken = await StakingToken.deploy("Staking Token", "STK", 1000000);
        await stakingToken.waitForDeployment();

        rewardsToken = await StakingToken.deploy("Rewards Token", "RWD", 10000000);
        await rewardsToken.waitForDeployment();

        // Deploy staking contract
        const StakingRewards = await ethers.getContractFactory("StakingRewards");
        stakingRewards = await StakingRewards.deploy(
            await stakingToken.getAddress(),
            await rewardsToken.getAddress(),
            REWARD_RATE
        );
        await stakingRewards.waitForDeployment();

        // Transfer rewards to staking contract
        await rewardsToken.transfer(
            await stakingRewards.getAddress(),
            ethers.parseEther("1000000")
        );

        // Transfer staking tokens to users
        await stakingToken.transfer(user1.address, ethers.parseEther("10000"));
        await stakingToken.transfer(user2.address, ethers.parseEther("10000"));
    });

    describe("Staking", function () {
        it("Should allow users to stake tokens", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount);
            await stakingRewards.connect(user1).stake(stakeAmount);

            expect(await stakingRewards.stakedBalance(user1.address)).to.equal(stakeAmount);
            expect(await stakingRewards.totalStaked()).to.equal(stakeAmount);
        });

        it("Should fail when staking 0 tokens", async function () {
            await expect(
                stakingRewards.connect(user1).stake(0)
            ).to.be.revertedWith("Cannot stake 0");
        });

        it("Should fail when staking without approval", async function () {
            const stakeAmount = ethers.parseEther("1000");
            await expect(
                stakingRewards.connect(user1).stake(stakeAmount)
            ).to.be.reverted;
        });
    });

    describe("Rewards", function () {
        it("Should calculate rewards correctly", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount);
            await stakingRewards.connect(user1).stake(stakeAmount);

            // Advance time by 1000 seconds
            await time.increase(1000);

            const earned = await stakingRewards.earned(user1.address);
            const expectedReward = REWARD_RATE * 1000n;

            // Allow small difference due to block timestamp
            expect(earned).to.be.closeTo(expectedReward, ethers.parseEther("0.01"));
        });

        it("Should distribute rewards proportionally to multiple stakers", async function () {
            const stakeAmount1 = ethers.parseEther("1000");
            const stakeAmount2 = ethers.parseEther("3000");

            await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount1);
            await stakingRewards.connect(user1).stake(stakeAmount1);

            await stakingToken.connect(user2).approve(await stakingRewards.getAddress(), stakeAmount2);
            await stakingRewards.connect(user2).stake(stakeAmount2);

            await time.increase(1000);

            const earned1 = await stakingRewards.earned(user1.address);
            const earned2 = await stakingRewards.earned(user2.address);

            // User2 should earn ~3x more than user1
            expect(earned2).to.be.closeTo(earned1 * 3n, ethers.parseEther("0.1"));
        });
    });

    describe("Withdrawing", function () {
        it("Should allow users to withdraw staked tokens", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount);
            await stakingRewards.connect(user1).stake(stakeAmount);

            const balanceBefore = await stakingToken.balanceOf(user1.address);
            await stakingRewards.connect(user1).withdraw(stakeAmount);
            const balanceAfter = await stakingToken.balanceOf(user1.address);

            expect(balanceAfter - balanceBefore).to.equal(stakeAmount);
            expect(await stakingRewards.stakedBalance(user1.address)).to.equal(0);
        });

        it("Should fail when withdrawing more than staked", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount);
            await stakingRewards.connect(user1).stake(stakeAmount);

            await expect(
                stakingRewards.connect(user1).withdraw(ethers.parseEther("2000"))
            ).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("Claiming Rewards", function () {
        it("Should allow users to claim rewards", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount);
            await stakingRewards.connect(user1).stake(stakeAmount);

            await time.increase(1000);

            const earnedBefore = await stakingRewards.earned(user1.address);
            const balanceBefore = await rewardsToken.balanceOf(user1.address);

            await stakingRewards.connect(user1).getReward();

            const balanceAfter = await rewardsToken.balanceOf(user1.address);
            const earnedAfter = await stakingRewards.earned(user1.address);

            expect(balanceAfter - balanceBefore).to.be.closeTo(earnedBefore, ethers.parseEther("0.01"));
            expect(earnedAfter).to.equal(0);
        });
    });

    describe("Exit", function () {
        it("Should allow users to exit (withdraw all and claim rewards)", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount);
            await stakingRewards.connect(user1).stake(stakeAmount);

            await time.increase(1000);

            const stakingBalanceBefore = await stakingToken.balanceOf(user1.address);
            const rewardsBalanceBefore = await rewardsToken.balanceOf(user1.address);

            await stakingRewards.connect(user1).exit();

            const stakingBalanceAfter = await stakingToken.balanceOf(user1.address);
            const rewardsBalanceAfter = await rewardsToken.balanceOf(user1.address);

            expect(stakingBalanceAfter - stakingBalanceBefore).to.equal(stakeAmount);
            expect(rewardsBalanceAfter).to.be.greaterThan(rewardsBalanceBefore);
            expect(await stakingRewards.stakedBalance(user1.address)).to.equal(0);
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to update reward rate", async function () {
            const newRate = ethers.parseEther("0.0002");
            await stakingRewards.setRewardRate(newRate);
            expect(await stakingRewards.rewardRate()).to.equal(newRate);
        });

        it("Should fail when non-owner tries to update reward rate", async function () {
            const newRate = ethers.parseEther("0.0002");
            await expect(
                stakingRewards.connect(user1).setRewardRate(newRate)
            ).to.be.reverted;
        });
    });
});
