// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StakingRewards.sol";
import "./StakingToken.sol";

/**
 * @title StakingFactory
 * @dev Factory contract for deploying staking pools
 */
contract StakingFactory {
    struct StakingPool {
        address stakingContract;
        address stakingToken;
        address rewardsToken;
        address creator;
        uint256 createdAt;
    }

    StakingPool[] public stakingPools;
    mapping(address => address[]) public userPools;

    event StakingPoolCreated(
        address indexed creator,
        address indexed stakingContract,
        address stakingToken,
        address rewardsToken,
        uint256 rewardRate
    );

    event TokenDeployed(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol
    );

    /**
     * @dev Deploy a new ERC20 token
     */
    function deployToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) external returns (address) {
        StakingToken token = new StakingToken(name, symbol, initialSupply);
        token.transferOwnership(msg.sender);

        emit TokenDeployed(msg.sender, address(token), name, symbol);
        return address(token);
    }

    /**
     * @dev Create a new staking pool
     */
    function createStakingPool(
        address _stakingToken,
        address _rewardsToken,
        uint256 _rewardRate
    ) external returns (address) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardsToken != address(0), "Invalid rewards token");
        require(_rewardRate > 0, "Reward rate must be > 0");

        StakingRewards stakingContract = new StakingRewards(
            _stakingToken,
            _rewardsToken,
            _rewardRate
        );

        stakingContract.transferOwnership(msg.sender);

        StakingPool memory pool = StakingPool({
            stakingContract: address(stakingContract),
            stakingToken: _stakingToken,
            rewardsToken: _rewardsToken,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        stakingPools.push(pool);
        userPools[msg.sender].push(address(stakingContract));

        emit StakingPoolCreated(
            msg.sender,
            address(stakingContract),
            _stakingToken,
            _rewardsToken,
            _rewardRate
        );

        return address(stakingContract);
    }

    /**
     * @dev Get total number of staking pools
     */
    function getPoolCount() external view returns (uint256) {
        return stakingPools.length;
    }

    /**
     * @dev Get pools created by a user
     */
    function getUserPools(
        address user
    ) external view returns (address[] memory) {
        return userPools[user];
    }

    /**
     * @dev Get pool info by index
     */
    function getPoolInfo(
        uint256 index
    )
        external
        view
        returns (
            address stakingContract,
            address stakingToken,
            address rewardsToken,
            address creator,
            uint256 createdAt
        )
    {
        require(index < stakingPools.length, "Invalid index");
        StakingPool memory pool = stakingPools[index];
        return (
            pool.stakingContract,
            pool.stakingToken,
            pool.rewardsToken,
            pool.creator,
            pool.createdAt
        );
    }
}
