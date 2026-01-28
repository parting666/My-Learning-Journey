import { useAccount, useBalance, useChainId, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { networks, abis } from "../config/contracts";
import { polygonAmoy, sepolia, mainnet, hardhat } from "wagmi/chains";
import { Address, erc20Abi, formatUnits, isAddress, parseEther, parseUnits } from 'viem'

export type TokenType = 'ERC20' | 'ERC721' | 'ERC1155';

export default function useStakingInfo(stakingContractAddress?: Address, tokenType: TokenType = 'ERC20') {
    const { address, isConnected } = useAccount();
    const [stakeAmount, setStakeAmount] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isApproving, setIsApproving] = useState(false);

    const [isFunding, setIsFunding] = useState(false);

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });
    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();

    const networkConfig = useMemo(() => {
        return (networks as any)[currentChainId.toString()];
    }, [currentChainId, networks]);

    // Fallback token addresses from config
    const fallbackTokenAddress = useMemo(() => {
        if (!networkConfig) return undefined;
        switch (tokenType) {
            case 'ERC721': return networkConfig.testERC721;
            case 'ERC1155': return networkConfig.testERC1155;
            default: return networkConfig.stakingToken;
        }
    }, [tokenType, networkConfig]);

    const activeStakingAddress = useMemo(() => {
        if (stakingContractAddress) return stakingContractAddress;
        if (!networkConfig) return undefined;
        switch (tokenType) {
            case 'ERC721': return networkConfig.default721Pool;
            case 'ERC1155': return networkConfig.default1155Pool;
            default: return networkConfig.defaultPool;
        }
    }, [stakingContractAddress, networkConfig, tokenType]);

    // Helper to get ABI based on token type
    const stakingAbi = useMemo(() => {
        switch (tokenType) {
            case 'ERC721': return abis?.ERC721StakingRewards;
            case 'ERC1155': return abis?.ERC1155StakingRewards;
            default: return abis?.StakingRewards;
        }
    }, [tokenType]);

    // Read staking token address from contract, fallback to config if no active pool
    const { data: contractStakingTokenAddress } = useReadContract({
        address: activeStakingAddress,
        abi: stakingAbi,
        functionName: 'stakingToken',
        chainId: currentChainId,
        query: { enabled: !!activeStakingAddress }
    });

    const stakingTokenAddress = (contractStakingTokenAddress || fallbackTokenAddress) as Address;

    // Read staking token balance
    const { data: erc20TokenBalance, refetch: refetchERC20Balance } = useReadContract({
        address: stakingTokenAddress as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
        chainId: currentChainId,
        query: { enabled: !!address && !!stakingTokenAddress && tokenType === 'ERC20', refetchInterval: 10_000 }
    });

    const { data: erc721TokenBalance, refetch: refetchERC721Balance } = useReadContract({
        address: stakingTokenAddress as Address,
        abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
        functionName: 'balanceOf',
        args: [address],
        chainId: currentChainId,
        query: { enabled: !!address && !!stakingTokenAddress && tokenType === 'ERC721', refetchInterval: 10_000 }
    });

    const { data: erc1155TokenBalance, refetch: refetchERC1155Balance } = useReadContract({
        address: stakingTokenAddress as Address,
        abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }, { name: 'id', type: 'uint256' }], outputs: [{ name: '', type: 'uint256' }] }],
        functionName: 'balanceOf',
        args: [address, BigInt(tokenId || '1')], // Default to ID 1 if not set
        chainId: currentChainId,
        query: { enabled: !!address && !!stakingTokenAddress && tokenType === 'ERC1155', refetchInterval: 10_000 }
    });

    const tokenBalance = useMemo(() => {
        if (tokenType === 'ERC20') return erc20TokenBalance;
        if (tokenType === 'ERC721') return erc721TokenBalance;
        if (tokenType === 'ERC1155') return erc1155TokenBalance;
        return undefined;
    }, [tokenType, erc20TokenBalance, erc721TokenBalance, erc1155TokenBalance]);

    const refetchTokenBalance = () => {
        refetchERC20Balance();
        refetchERC721Balance();
        refetchERC1155Balance();
    };

    // Read staked balance
    const { data: stakedBalance, refetch: refetchStakedBalance } = useReadContract({
        address: activeStakingAddress,
        abi: stakingAbi,
        functionName: tokenType === 'ERC20' ? 'stakedBalance' : (tokenType === 'ERC721' ? 'nftStakedBalance' : 'unitStakedBalance'),
        args: [address],
        chainId: currentChainId,
        query: { enabled: !!address && !!activeStakingAddress }
    });

    // Read earned rewards
    const { data: earnedRewards, refetch: refetchEarned } = useReadContract({
        address: activeStakingAddress,
        abi: stakingAbi,
        functionName: 'earned',
        args: [address],
        chainId: currentChainId,
        query: { enabled: !!address && !!activeStakingAddress }
    });

    // Read allowance (ERC20 only)
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: stakingTokenAddress as Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, activeStakingAddress],
        chainId: currentChainId,
        query: { enabled: !!address && !!stakingTokenAddress && tokenType === 'ERC20' }
    });

    // Read pool reward balance (PRT balance of the staking pool)
    const { data: poolRewardBalance, refetch: refetchPoolRewardBalance } = useReadContract({
        address: networkConfig?.rewardsToken as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [activeStakingAddress],
        chainId: currentChainId,
        query: { enabled: !!activeStakingAddress && !!networkConfig?.rewardsToken }
    });

    // Read NFT approval
    const { data: isApprovedForAll, refetch: refetchApproval } = useReadContract({
        address: stakingTokenAddress as Address,
        abi: [
            { name: 'isApprovedForAll', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }, { name: 'operator', type: 'address' }], outputs: [{ name: '', type: 'bool' }] }
        ],
        functionName: 'isApprovedForAll',
        args: [address, activeStakingAddress],
        chainId: currentChainId,
        query: { enabled: !!address && !!stakingTokenAddress && tokenType !== 'ERC20' }
    });

    // Handle transaction success
    useEffect(() => {
        if (isSuccess) {
            setIsApproving(false);
            setIsFunding(false);
            // Refetch all relevant state
            refetchTokenBalance();
            refetchStakedBalance();
            refetchEarned();
            refetchAllowance();
            refetchApproval();
            refetchPoolRewardBalance();
        }
    }, [isSuccess]);

    const needsApproval = useMemo(() => {
        if (!isConnected) return false;
        if (tokenType === 'ERC20') {
            if (!stakeAmount || allowance === undefined) return false;
            try {
                const amountToStake = parseUnits(stakeAmount, 18);
                return (allowance as bigint) < amountToStake;
            } catch (e) {
                return false;
            }
        } else {
            return isApprovedForAll === false;
        }
    }, [isConnected, stakeAmount, allowance, tokenType, isApprovedForAll]);

    const targetChain = useMemo(() => {
        switch (currentChainId) {
            case 80002: return polygonAmoy;
            case 11155111: return sepolia;
            case 1: return mainnet;
            default: return hardhat;
        }
    }, [currentChainId]);

    const targetChainName = targetChain.name;

    const handleApprove = async () => {
        if (!stakingTokenAddress) return;
        setIsApproving(true);
        try {
            if (tokenType === 'ERC20') {
                writeContract({
                    abi: erc20Abi,
                    address: stakingTokenAddress as Address,
                    functionName: 'approve',
                    args: [activeStakingAddress as Address, parseUnits(stakeAmount, 18)],
                    chainId: currentChainId,
                    account: address,
                    chain: targetChain
                });
            } else {
                writeContract({
                    abi: [
                        { name: 'setApprovalForAll', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }], outputs: [] }
                    ],
                    address: stakingTokenAddress as Address,
                    functionName: 'setApprovalForAll',
                    args: [activeStakingAddress as Address, true],
                    chainId: currentChainId,
                    account: address,
                    chain: targetChain
                });
            }
        } catch (error) {
            console.error('Approval error:', error);
            setIsApproving(false);
        }
    };

    const handleStake = async () => {
        if (!activeStakingAddress) return;
        setIsApproving(false);
        try {
            // Default to ID 1 for ERC1155, 0 for others
            const defaultId = tokenType === 'ERC1155' ? '1' : '0';
            const safeTokenId = tokenId ? BigInt(tokenId) : BigInt(defaultId);
            const args = tokenType === 'ERC20'
                ? [parseUnits(stakeAmount, 18)]
                : (tokenType === 'ERC721' ? [safeTokenId] : [safeTokenId, BigInt(stakeAmount || '0')]);

            writeContract({
                abi: stakingAbi,
                address: activeStakingAddress as Address,
                functionName: 'stake',
                args,
                chainId: currentChainId,
                account: address,
                chain: targetChain
            });
        } catch (error) {
            console.error('Stake error:', error);
        }
    };

    const handleWithdraw = async () => {
        if (!activeStakingAddress) return;
        try {
            const defaultId = tokenType === 'ERC1155' ? '1' : '0';
            const safeTokenId = tokenId ? BigInt(tokenId) : BigInt(defaultId);
            const args = tokenType === 'ERC20'
                ? [parseUnits(withdrawAmount, 18)]
                : (tokenType === 'ERC721' ? [safeTokenId] : [safeTokenId, BigInt(withdrawAmount || '0')]);

            writeContract({
                abi: stakingAbi,
                address: activeStakingAddress as Address,
                functionName: 'withdraw',
                args,
                chainId: currentChainId,
                account: address,
                chain: targetChain
            });
        } catch (error) {
            console.error('Withdraw error:', error);
        }
    };

    const handleClaimRewards = async () => {
        if (!activeStakingAddress) return;
        try {
            writeContract({
                abi: stakingAbi,
                address: activeStakingAddress as Address,
                functionName: 'getReward',
                chainId: currentChainId,
                account: address,
                chain: targetChain
            });
        } catch (error) {
            console.error('Claim rewards error:', error);
        }
    };

    const handleMint = async () => {
        if (!stakingTokenAddress || !address) return;
        try {
            writeContract({
                abi: abis?.StakingToken,
                address: stakingTokenAddress as Address,
                functionName: 'mint',
                args: [address, parseUnits('1000', 18)],
                chainId: currentChainId,
                account: address,
                chain: targetChain
            });
        } catch (error) {
            console.error('Mint error:', error);
        }
    };

    const handleCreatePool = async (tokenAddress: string, rewardRate: string) => {
        if (!networkConfig?.stakingFactory || !address) return;
        try {
            const funcName = tokenType === 'ERC721' ? 'createERC721StakingPool' : (tokenType === 'ERC1155' ? 'createERC1155StakingPool' : 'createStakingPool');
            writeContract({
                abi: abis?.StakingFactory,
                address: networkConfig.stakingFactory as Address,
                functionName: funcName,
                args: [tokenAddress, networkConfig.rewardsToken, parseUnits(rewardRate, 18)],
                chainId: currentChainId,
                account: address,
                chain: targetChain
            });
        } catch (error) {
            console.error('Create pool error:', error);
        }
    };

    const handleFundPool = async (amount: string) => {
        if (!networkConfig?.rewardsToken || !activeStakingAddress || !address) return;
        setIsFunding(true);
        try {
            writeContract({
                abi: abis?.StakingToken,
                address: networkConfig.rewardsToken as Address,
                functionName: 'mint',
                args: [activeStakingAddress, parseUnits(amount, 18)],
                chainId: currentChainId,
                account: address,
                chain: targetChain
            });
        } catch (error) {
            console.error('Fund pool error:', error);
            setIsFunding(false);
        }
    };

    // ... handleExit etc would also need updating if used ...

    return {
        handleApprove,
        handleStake,
        handleWithdraw,
        handleClaimRewards,
        handleMint,
        handleCreatePool,
        handleFundPool,
        needsApproval,
        isApproving,
        isFunding,
        allowance,
        stakedBalance,
        earnedRewards,
        poolRewardBalance,
        tokenBalance,
        stakingTokenAddress,
        isConnected,
        address,
        writeContract,
        hash,
        receipt,
        isPending,
        isConfirming,
        isSuccess,
        stakeAmount,
        setStakeAmount,
        withdrawAmount,
        setWithdrawAmount,
        tokenId,
        setTokenId,
        refetchTokenBalance,
        refetchStakedBalance,
        refetchEarned,
        refetchAllowance,
        currentChainId,
        networkConfig,
        targetChainName
    };
}