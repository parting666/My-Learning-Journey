// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MyERC1155Token
 * @dev ERC1155 多代币合约，支持同质化和非同质化代币
 */
contract MyERC1155Token is ERC1155, ERC1155Supply, Ownable {
    using Strings for uint256;

    // 代币名称
    string public name;
    // 代币符号
    string public symbol;
    // 下一个代币ID
    uint256 private _nextTokenId;
    // 代币URI映射
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev 构造函数
     * @param _name 代币名称
     * @param _symbol 代币符号
     * @param baseURI 基础URI
     */
    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseURI
    ) ERC1155(baseURI) Ownable(msg.sender) {
        name = _name;
        symbol = _symbol;
    }

    /**
     * @dev 设置基础URI（仅所有者）
     * @param newuri 新的基础URI
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /**
     * @dev 设置特定代币的URI
     * @param tokenId 代币ID
     * @param tokenURI 代币URI
     */
    function setTokenURI(
        uint256 tokenId,
        string memory tokenURI
    ) public onlyOwner {
        _tokenURIs[tokenId] = tokenURI;
    }

    /**
     * @dev 返回特定代币的URI
     * @param tokenId 代币ID
     */
    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];

        // 如果有特定的tokenURI，返回它
        if (bytes(tokenURI).length > 0) {
            return tokenURI;
        }

        // 否则返回基础URI + tokenId
        string memory baseURI = super.uri(tokenId);
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    /**
     * @dev 铸造单个代币
     * @param to 接收地址
     * @param id 代币ID
     * @param amount 数量
     * @param data 额外数据
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(to, id, amount, data);
    }

    /**
     * @dev 批量铸造代币
     * @param to 接收地址
     * @param ids 代币ID数组
     * @param amounts 数量数组
     * @param data 额外数据
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
     * @dev 创建新的代币类型并铸造
     * @param to 接收地址
     * @param amount 初始供应量
     * @param tokenURI 代币URI
     * @param data 额外数据
     * @return 新创建的代币ID
     */
    function create(
        address to,
        uint256 amount,
        string memory tokenURI,
        bytes memory data
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId, amount, data);

        if (bytes(tokenURI).length > 0) {
            _tokenURIs[tokenId] = tokenURI;
        }

        return tokenId;
    }

    /**
     * @dev 销毁代币
     * @param from 代币持有者地址
     * @param id 代币ID
     * @param amount 销毁数量
     */
    function burn(address from, uint256 id, uint256 amount) public {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );
        _burn(from, id, amount);
    }

    /**
     * @dev 批量销毁代币
     * @param from 代币持有者地址
     * @param ids 代币ID数组
     * @param amounts 销毁数量数组
     */
    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );
        _burnBatch(from, ids, amounts);
    }

    /**
     * @dev 获取下一个代币ID
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev 重写更新函数以支持ERC1155Supply
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    /**
     * @dev 批量转账到不同接收者
     * @param recipients 接收地址数组
     * @param ids 代币ID数组
     * @param amounts 数量数组
     */
    function batchTransferMultiple(
        address[] memory recipients,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public {
        require(
            recipients.length == ids.length && ids.length == amounts.length,
            "Arrays length mismatch"
        );
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            safeTransferFrom(msg.sender, recipients[i], ids[i], amounts[i], "");
        }
    }
}
