// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyNFT
 * @dev 与 OpenZeppelin Contracts v5.0+ 兼容的最终版本.
 * 移除了所有不必要的函数重写 (override), 直接继承父合约的正确实现.
 */
contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol
    )
        ERC721(name, symbol)
        Ownable(initialOwner)
    {}

    /**
     * @dev 安全地铸造一个新的 NFT.
     * @param _to NFT 接收者的地址.
     * @param _tokenURI NFT 元数据的 IPFS 链接.
     */
    function safeMint(address _to, string memory _tokenURI) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

}