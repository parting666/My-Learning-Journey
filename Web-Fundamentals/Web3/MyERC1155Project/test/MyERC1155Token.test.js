const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyERC1155Token", function () {
  let MyERC1155Token;
  let myERC1155Token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    MyERC1155Token = await ethers.getContractFactory("MyERC1155Token");
    myERC1155Token = await MyERC1155Token.deploy(owner.address);
    await myERC1155Token.waitForDeployment();
  });

  it("Should mint a new token", async function () {
    await myERC1155Token.mint(addr1.address, 1, 100, "0x");
    expect(await myERC1155Token.balanceOf(addr1.address, 1)).to.equal(100);
  });

  it("Should perform a batch mint", async function () {
    await myERC1155Token.mintBatch(addr1.address, [0, 1], [50, 100], "0x");
    expect(await myERC1155Token.balanceOf(addr1.address, 0)).to.equal(50);
    expect(await myERC1155Token.balanceOf(addr1.address, 1)).to.equal(100);
  });

  it("Should allow transfers", async function () {
    await myERC1155Token.mint(addr1.address, 1, 100, "0x");
    await myERC1155Token.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 1, 50, "0x");
    expect(await myERC1155Token.balanceOf(addr2.address, 1)).to.equal(50);
  });

  it("Should allow batch transfers", async function () {
    await myERC1155Token.mintBatch(addr1.address, [0, 1], [50, 100], "0x");
    await myERC1155Token.connect(addr1).batchTransfer(addr1.address, addr2.address, [0, 1], [20, 30], "0x");
    expect(await myERC1155Token.balanceOf(addr2.address, 0)).to.equal(20);
    expect(await myERC1155Token.balanceOf(addr2.address, 1)).to.equal(30);
    expect(await myERC1155Token.balanceOf(addr1.address, 0)).to.equal(30);
    expect(await myERC1155Token.balanceOf(addr1.address, 1)).to.equal(70);
  });
});