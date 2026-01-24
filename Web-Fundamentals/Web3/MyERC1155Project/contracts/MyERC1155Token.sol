// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC1155Token is ERC1155, Ownable {
    // Example Constants (Optional: Define your own token IDs here)
    // uint256 public constant GOLD = 0;
    // uint256 public constant SILVER = 1;

    // Mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    constructor(
        address initialOwner
    ) ERC1155("") Ownable(initialOwner) {
        // Example: Initial minting logic
        // You can pre-mint tokens here if needed
        /*
        uint256[] memory ids = new uint256[](2);
        uint256[] memory amounts = new uint256[](2);

        ids[0] = 0;
        amounts[0] = 100; // Mint 100 Gold

        ids[1] = 1;
        amounts[1] = 200; // Mint 200 Silver

        _mintBatch(initialOwner, ids, amounts, "");
        */
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];
        return bytes(tokenURI).length > 0 ? tokenURI : super.uri(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        _tokenURIs[tokenId] = tokenURI;
        emit URI(tokenURI, tokenId);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function batchTransfer(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
