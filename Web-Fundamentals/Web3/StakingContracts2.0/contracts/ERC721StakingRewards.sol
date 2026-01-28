// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ERC721StakingRewards
 * @dev Staking contract for ERC721 tokens that rewards users with ERC20 tokens
 */
contract ERC721StakingRewards is Ownable, ReentrancyGuard, IERC721Receiver {
    using SafeERC20 for IERC20;

    IERC721 public stakingToken;
    IERC20 public rewardsToken;

    uint256 public rewardRate; // Rewards per NFT per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerNFTStored;
    uint256 public totalNFTsStaked;

    mapping(address => uint256) public nftStakedBalance;
    mapping(address => uint256) public userRewardPerNFTPaid;
    mapping(address => uint256) public rewards;
    mapping(uint256 => address) public tokenOwners;

    event Staked(address indexed user, uint256 tokenId);
    event Withdrawn(address indexed user, uint256 tokenId);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    constructor(
        address _stakingToken,
        address _rewardsToken,
        uint256 _rewardRate
    ) Ownable(msg.sender) {
        stakingToken = IERC721(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }

    function rewardPerNFT() public view returns (uint256) {
        if (totalNFTsStaked == 0) {
            return rewardPerNFTStored;
        }
        return
            rewardPerNFTStored +
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) /
                totalNFTsStaked);
    }

    function earned(address account) public view returns (uint256) {
        return
            ((nftStakedBalance[account] *
                (rewardPerNFT() - userRewardPerNFTPaid[account])) / 1e18) +
            rewards[account];
    }

    modifier updateReward(address account) {
        rewardPerNFTStored = rewardPerNFT();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerNFTPaid[account] = rewardPerNFTStored;
        }
        _;
    }

    function stake(uint256 tokenId) external nonReentrant updateReward(msg.sender) {
        stakingToken.safeTransferFrom(msg.sender, address(this), tokenId);
        
        tokenOwners[tokenId] = msg.sender;
        nftStakedBalance[msg.sender] += 1;
        totalNFTsStaked += 1;

        emit Staked(msg.sender, tokenId);
    }

    function withdraw(uint256 tokenId) external nonReentrant updateReward(msg.sender) {
        require(tokenOwners[tokenId] == msg.sender, "Not the owner");

        delete tokenOwners[tokenId];
        nftStakedBalance[msg.sender] -= 1;
        totalNFTsStaked -= 1;

        stakingToken.safeTransferFrom(address(this), msg.sender, tokenId);

        emit Withdrawn(msg.sender, tokenId);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
