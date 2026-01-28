// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyERC20Token
 * @dev ERC20 代币合约，支持铸造和销毁功能
 */
contract MyERC20Token is ERC20, Ownable {
    uint8 private _decimals;

    /**
     * @dev 构造函数
     * @param name 代币名称
     * @param symbol 代币符号
     * @param initialSupply 初始供应量
     * @param tokenDecimals 代币精度
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 tokenDecimals
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _decimals = tokenDecimals;
        _mint(msg.sender, initialSupply * 10 ** tokenDecimals);
    }

    /**
     * @dev 返回代币精度
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev 铸造新代币（仅所有者）
     * @param to 接收地址
     * @param amount 铸造数量
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev 销毁代币
     * @param amount 销毁数量
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @dev 批量转账
     * @param recipients 接收地址数组
     * @param amounts 转账金额数组
     */
    function batchTransfer(
        address[] memory recipients,
        uint256[] memory amounts
    ) public returns (bool) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Transfer to zero address");
            require(
                amounts[i] > 0,
                "Transfer amount must be greater than zero"
            );
            _transfer(msg.sender, recipients[i], amounts[i]);
        }

        return true;
    }
}
