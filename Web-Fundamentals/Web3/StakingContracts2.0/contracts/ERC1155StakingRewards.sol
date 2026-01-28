// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ERC1155StakingRewards
 * @dev Staking contract for ERC1155 tokens that rewards users with ERC20 tokens
 */
contract ERC1155StakingRewards is Ownable, ReentrancyGuard, IERC1155Receiver {
    using SafeERC20 for IERC20;

    IERC1155 public stakingToken;
    IERC20 public rewardsToken;

    uint256 public rewardRate; // Rewards per unit per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerUnitStored;
    uint256 public totalUnitsStaked;

    mapping(address => uint256) public unitStakedBalance;
    mapping(address => uint256) public userRewardPerUnitPaid;
    mapping(address => uint256) public rewards;

    // Tracks amount of each tokenId staked by each user
    mapping(address => mapping(uint256 => uint256)) public userStakedAmount;

    event Staked(address indexed user, uint256 tokenId, uint256 amount);
    event Withdrawn(address indexed user, uint256 tokenId, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    constructor(
        address _stakingToken,
        address _rewardsToken,
        uint256 _rewardRate
    ) Ownable(msg.sender) {
        stakingToken = IERC1155(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }

    function rewardPerUnit() public view returns (uint256) {
        if (totalUnitsStaked == 0) {
            return rewardPerUnitStored;
        }
        return
            rewardPerUnitStored +
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) /
                totalUnitsStaked);
    }

    function earned(address account) public view returns (uint256) {
        return
            ((unitStakedBalance[account] *
                (rewardPerUnit() - userRewardPerUnitPaid[account])) / 1e18) +
            rewards[account];
    }

    modifier updateReward(address account) {
        rewardPerUnitStored = rewardPerUnit();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerUnitPaid[account] = rewardPerUnitStored;
        }
        _;
    }

    function stake(
        uint256 tokenId,
        uint256 amount
    ) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");

        stakingToken.safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );

        userStakedAmount[msg.sender][tokenId] += amount;
        unitStakedBalance[msg.sender] += amount;
        totalUnitsStaked += amount;

        emit Staked(msg.sender, tokenId, amount);
    }

    function withdraw(
        uint256 tokenId,
        uint256 amount
    ) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(
            userStakedAmount[msg.sender][tokenId] >= amount,
            "Insufficient staked amount"
        );

        userStakedAmount[msg.sender][tokenId] -= amount;
        unitStakedBalance[msg.sender] -= amount;
        totalUnitsStaked -= amount;

        stakingToken.safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ""
        );

        emit Withdrawn(msg.sender, tokenId, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function setRewardRate(
        uint256 _rewardRate
    ) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }

    // IERC1155Receiver implementation
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure override returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == 0x01ffc9a7;
    }
}
