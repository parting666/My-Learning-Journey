// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestERC1155
 * @dev A simple ERC1155 token for testing staking.
 */
contract TestERC1155 is ERC1155, Ownable {
    uint256 public constant STAKING_ITEM = 1;

    constructor()
        ERC1155("https://api.example.com/metadata/{id}.json")
        Ownable(msg.sender)
    {
        // Mint 100,000 units of STAKING_ITEM for testing.
        _mint(msg.sender, STAKING_ITEM, 100000, "");
    }

    /**
     * @dev Mint function for owner.
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    /**
     * @dev Batch mint function for owner.
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @dev Set new URI.
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
