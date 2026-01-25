const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Using account:", signer.address);
  console.log("Network:", hre.network.name);

  const configPath = path.join(__dirname, "../frontend/src/config/contracts.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("contracts.json not found. Please run the deploy script first.");
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const addresses = cfg.contracts;

  const stakingToken = await hre.ethers.getContractAt("StakingToken", addresses.StakingToken.address);
  const stakingRewards = await hre.ethers.getContractAt("StakingRewards", addresses.StakingRewards.address);

  const decimals = await stakingToken.decimals();
  const amount = hre.ethers.parseUnits("100", decimals); // stake 100 tokens

  const bal = await stakingToken.balanceOf(signer.address);
  console.log("Current PT balance:", hre.ethers.formatUnits(bal, decimals));

  console.log("Approving allowance to StakingRewards:", addresses.StakingRewards.address);
  const approveTx = await stakingToken.approve(addresses.StakingRewards.address, amount);
  await approveTx.wait();
  console.log("Approve tx done:", approveTx.hash);

  console.log("Staking amount:", hre.ethers.formatUnits(amount, decimals));
  const stakeTx = await stakingRewards.stake(amount);
  const receipt = await stakeTx.wait();
  console.log("Stake tx done:", stakeTx.hash);

  const status = await stakingRewards.getAccountStatus(signer.address);
  console.log("Account status after staking:");
  console.log(" - balance:", hre.ethers.formatUnits(status.balance, decimals));
  console.log(" - allowance:", hre.ethers.formatUnits(status.allowance, decimals));
  console.log(" - staked:", hre.ethers.formatUnits(status.staked, decimals));

  const staked = await stakingRewards.stakedBalance(signer.address);
  console.log("StakedBalance:", hre.ethers.formatUnits(staked, decimals));

  const stEvent = receipt.logs?.length ? "Staked event emitted" : "Stake tx processed";
  console.log(stEvent);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
