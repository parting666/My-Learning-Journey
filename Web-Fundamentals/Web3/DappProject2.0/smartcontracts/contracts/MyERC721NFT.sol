// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MyERC721NFT
 * @dev ERC721 NFT合约，支持元数据URI和批量铸造
 */
contract MyERC721NFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    string private _baseTokenURI;

    /**
     * @dev 构造函数
     * @param name NFT名称
     * @param symbol NFT符号
     * @param baseURI 基础URI
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev 设置基础URI（仅所有者）
     * @param baseURI 新的基础URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev 返回基础URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev 铸造NFT
     * @param to 接收地址
     * @param uri 元数据URI
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev 批量铸造NFT
     * @param to 接收地址
     * @param amount 铸造数量
     */
    function batchMint(address to, uint256 amount) public onlyOwner {
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }

    /**
     * @dev 返回tokenURI
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev 支持的接口
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev 批量转账NFT
     * @param to 接收地址
     * @param tokenIds 代币ID数组
     */
    function batchTransfer(address to, uint256[] memory tokenIds) public {
        require(to != address(0), "Transfer to zero address");
        require(tokenIds.length > 0, "Empty token IDs array");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                ownerOf(tokenIds[i]) == msg.sender ||
                    getApproved(tokenIds[i]) == msg.sender ||
                    isApprovedForAll(ownerOf(tokenIds[i]), msg.sender),
                "Not owner nor approved"
            );
            safeTransferFrom(msg.sender, to, tokenIds[i]);
        }
    }

    /**
     * @dev 批量转账NFT到不同地址
     * @param recipients 接收地址数组
     * @param tokenIds 代币ID数组
     */
    function batchTransferMultiple(
        address[] memory recipients,
        uint256[] memory tokenIds
    ) public {
        require(recipients.length == tokenIds.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Transfer to zero address");
            require(
                ownerOf(tokenIds[i]) == msg.sender ||
                    getApproved(tokenIds[i]) == msg.sender ||
                    isApprovedForAll(ownerOf(tokenIds[i]), msg.sender),
                "Not owner nor approved"
            );
            safeTransferFrom(msg.sender, recipients[i], tokenIds[i]);
        }
    }
}
