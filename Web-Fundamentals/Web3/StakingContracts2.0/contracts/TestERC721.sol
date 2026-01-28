// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestERC721
 * @dev A simple ERC721 token for testing staking.
 */
contract TestERC721 is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("Test NFT", "TNFT") Ownable(msg.sender) {}

    /**
     * @dev Simple mint function for owner.
     */
    function mint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    /**
     * @dev Batch mint function to issue multiple tokens at once.
     * Note: Be careful with the amount to avoid exceeding gas limits.
     */
    function batchMint(address to, uint256 amount) public onlyOwner {
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }

    /**
     * @dev Get the next token ID to be minted.
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
}
