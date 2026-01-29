// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyERC20Token.sol";
import "./MyERC721NFT.sol";
import "./MyERC1155Token.sol";

/**
 * @title TokenFactory
 * @dev 代币工厂合约，用于部署 ERC20、ERC721 和 ERC1155 代币
 */
contract TokenFactory {
    // 部署信息结构
    struct DeploymentInfo {
        address tokenAddress;
        address deployer;
        uint256 timestamp;
        string tokenType; // "ERC20", "ERC721", "ERC1155"
        string name;
        string symbol;
    }

    // 所有部署记录
    DeploymentInfo[] public allDeployments;

    // 按类型分类的代币地址 (保留用于全局查询)
    address[] public erc20Tokens;
    address[] public erc721Tokens;
    address[] public erc1155Tokens;

    // 用户部署的代币映射 - 直接存储详细信息
    mapping(address => DeploymentInfo[]) public userDeployments;

    // 事件
    event ERC20Deployed(
        address indexed tokenAddress,
        address indexed deployer,
        string name,
        string symbol,
        uint256 initialSupply,
        uint8 decimals
    );

    event ERC721Deployed(
        address indexed tokenAddress,
        address indexed deployer,
        string name,
        string symbol,
        string baseURI
    );

    event ERC1155Deployed(
        address indexed tokenAddress,
        address indexed deployer,
        string name,
        string symbol,
        string baseURI
    );

    /**
     * @dev 部署 ERC20 代币
     */
    function deployERC20(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals
    ) public returns (address) {
        MyERC20Token token = new MyERC20Token(
            name,
            symbol,
            initialSupply,
            decimals
        );
        address tokenAddress = address(token);

        // 将所有权转移给调用者
        token.transferOwnership(msg.sender);

        // 记录部署信息
        _recordDeployment(tokenAddress, "ERC20", name, symbol);
        erc20Tokens.push(tokenAddress);

        emit ERC20Deployed(
            tokenAddress,
            msg.sender,
            name,
            symbol,
            initialSupply,
            decimals
        );

        return tokenAddress;
    }

    /**
     * @dev 部署 ERC721 NFT
     */
    function deployERC721(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public returns (address) {
        MyERC721NFT nft = new MyERC721NFT(name, symbol, baseURI);
        address nftAddress = address(nft);

        // 将所有权转移给调用者
        nft.transferOwnership(msg.sender);

        // 记录部署信息
        _recordDeployment(nftAddress, "ERC721", name, symbol);
        erc721Tokens.push(nftAddress);

        emit ERC721Deployed(nftAddress, msg.sender, name, symbol, baseURI);

        return nftAddress;
    }

    /**
     * @dev 部署 ERC1155 多代币
     */
    function deployERC1155(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public returns (address) {
        MyERC1155Token token = new MyERC1155Token(name, symbol, baseURI);
        address tokenAddress = address(token);

        // 将所有权转移给调用者
        token.transferOwnership(msg.sender);

        // 记录部署信息
        _recordDeployment(tokenAddress, "ERC1155", name, symbol);
        erc1155Tokens.push(tokenAddress);

        emit ERC1155Deployed(tokenAddress, msg.sender, name, symbol, baseURI);

        return tokenAddress;
    }

    /**
     * @dev 记录部署信息（内部函数）
     */
    function _recordDeployment(
        address tokenAddress,
        string memory tokenType,
        string memory name,
        string memory symbol
    ) private {
        DeploymentInfo memory info = DeploymentInfo({
            tokenAddress: tokenAddress,
            deployer: msg.sender,
            timestamp: block.timestamp,
            tokenType: tokenType,
            name: name,
            symbol: symbol
        });

        allDeployments.push(info);
        userDeployments[msg.sender].push(info);
    }

    /**
     * @dev 获取用户部署的所有代币（包含详细信息）
     */
    function getUserDeployments(
        address user
    ) external view returns (DeploymentInfo[] memory) {
        return userDeployments[user];
    }

    /**
     * @dev 获取所有 ERC20 代币地址
     */
    function getAllERC20Tokens() external view returns (address[] memory) {
        return erc20Tokens;
    }

    /**
     * @dev 获取所有 ERC721 代币地址
     */
    function getAllERC721Tokens() external view returns (address[] memory) {
        return erc721Tokens;
    }

    /**
     * @dev 获取所有 ERC1155 代币地址
     */
    function getAllERC1155Tokens() external view returns (address[] memory) {
        return erc1155Tokens;
    }

    /**
     * @dev 获取总部署数量
     */
    function getTotalDeployments() external view returns (uint256) {
        return allDeployments.length;
    }

    /**
     * @dev 获取部署信息
     */
    function getDeploymentInfo(
        uint256 index
    ) external view returns (DeploymentInfo memory) {
        require(index < allDeployments.length, "Index out of bounds");
        return allDeployments[index];
    }
}
