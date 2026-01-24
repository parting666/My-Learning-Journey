const { ethers } = require("hardhat");

// Update ids and amounts as needed
const RECIPIENT = "0x256154edb85e691f483c63d138742f306e4255e1"; // target wallet address
const IDS = [0, 1];
const AMOUNTS = [2, 3];

async function main() {
  const signers = await ethers.getSigners();
  const owner = signers[0];
  const holder = signers[1] || owner; // Fallback to owner if only one signer is configured

  console.log("Owner:", owner.address);
  console.log("Holder:", holder.address);
  console.log("Recipient:", RECIPIENT);

  const MyERC1155Token = await ethers.getContractFactory("MyERC1155Token");
  const myERC1155Token = await MyERC1155Token.deploy(owner.address);
  await myERC1155Token.waitForDeployment();
  const contractAddress = await myERC1155Token.getAddress();
  console.log("Deployed MyERC1155Token at:", contractAddress);

  // Mint some tokens to the holder first (onlyOwner)
  console.log("Minting batch to holder:", IDS, AMOUNTS);
  await (await myERC1155Token.connect(owner).mintBatch(holder.address, IDS, AMOUNTS.map(a => a * 5), "0x")).wait();

  // Show balances before transfer
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    const balHolderBefore = await myERC1155Token.balanceOf(holder.address, id);
    const balRecipientBefore = await myERC1155Token.balanceOf(RECIPIENT, id);
    console.log(`Before -> ID ${id}: holder=${balHolderBefore.toString()} recipient=${balRecipientBefore.toString()}`);
  }

  // Perform batch transfer from holder to recipient
  console.log("Batch transferring:", IDS, AMOUNTS, "from", holder.address, "to", RECIPIENT);
  await (await myERC1155Token.connect(holder).batchTransfer(holder.address, RECIPIENT, IDS, AMOUNTS, "0x")).wait();

  // Show balances after transfer
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    const balHolderAfter = await myERC1155Token.balanceOf(holder.address, id);
    const balRecipientAfter = await myERC1155Token.balanceOf(RECIPIENT, id);
    console.log(`After -> ID ${id}: holder=${balHolderAfter.toString()} recipient=${balRecipientAfter.toString()}`);
  }

  console.log("Batch transfer complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});