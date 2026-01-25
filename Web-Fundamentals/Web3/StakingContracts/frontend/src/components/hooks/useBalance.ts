import { useAccount, useBalance, useChainId, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { contracts } from "../../config/contracts";
import { abis } from "../../config/contracts";
import { polygonAmoy, sepolia, mainnet, hardhat } from "wagmi/chains";
import { Address, erc20Abi, formatUnits, isAddress, parseEther } from 'viem'


export default function StakingInterface() {
    const { address, isConnected } = useAccount();
    const [stakeAmount, setStakeAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isApproving, setIsApproving] = useState(false);

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();

    // Calculate target chain ID safely
    const targetChainId = useMemo(() => {
        const name = contracts?.network?.toLowerCase();
        console.log('Target network:', name);
        switch (name) {
            case 'amoy': return polygonAmoy.id;
            case 'sepolia': return sepolia.id;
            case 'mainnet': return mainnet.id;
            default: return hardhat.id;
        }
    }, []);

    const isCorrectNetwork = useMemo(() => {
        if (!isConnected) return true; // Don't show warning if not connected
        return currentChainId === targetChainId;
    }, [isConnected, currentChainId, targetChainId]);

    // Debug logs
    useEffect(() => {
        console.log('Contracts config:', contracts);
        console.log('Target Chain ID:', targetChainId);
        console.log('Account:', address, 'Connected:', isConnected);
        console.log("address:", contracts?.contracts?.StakingToken?.address)
    }, [address, isConnected, targetChainId]);

    // Read native balance (MATIC/ETH)
    const { data: nativeBalance } = useBalance({
        address: address,
        chainId: targetChainId,
        query: { enabled: !!address }
    });

    // Read staking token balance
    const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
        address: contracts?.contracts?.StakingToken?.address as Address,
        abi: abis?.StakingToken,
        functionName: 'balanceOf',
        args: [address],
        chainId: targetChainId,
        query: { enabled: !!address, refetchInterval: 10_000, retry: false }
    });

    // Read staked balance
    const { data: stakedBalance, refetch: refetchStakedBalance } = useReadContract({
        address: contracts?.contracts?.StakingRewards?.address as Address,
        abi: abis?.StakingRewards,
        functionName: 'stakedBalance',
        args: [address],
        chainId: targetChainId,
        query: { enabled: !!address }
    });

    // Read earned rewards
    const { data: earnedRewards, refetch: refetchEarned } = useReadContract({
        address: contracts?.contracts?.StakingRewards?.address as Address,
        abi: abis?.StakingRewards,
        functionName: 'earned',
        args: [address],
        chainId: targetChainId,
        query: { enabled: !!address }
    });

    // Read total staked
    const { data: totalStaked } = useReadContract({
        address: contracts?.contracts?.StakingRewards?.address as Address,
        abi: abis?.StakingRewards,
        functionName: 'totalStaked',
        chainId: targetChainId,
    });

    // Read allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: contracts?.contracts?.StakingToken?.address as Address,
        abi: abis?.StakingToken,
        functionName: 'allowance',
        args: [address, contracts?.contracts?.StakingRewards?.address],
        chainId: targetChainId,
        query: { enabled: !!address }
    });

    // Read token symbols and names
    const { data: stakingTokenSymbol } = useReadContract({
        address: contracts?.contracts?.StakingToken?.address as Address,
        abi: abis?.StakingToken,
        functionName: 'symbol',
        chainId: targetChainId,
    });

    const { data: rewardsTokenSymbol } = useReadContract({
        address: contracts?.contracts?.RewardsToken?.address as Address,
        abi: abis?.StakingToken,
        functionName: 'symbol',
        chainId: targetChainId,
    });

    const { data: stakingTokenName } = useReadContract({
        address: contracts?.contracts?.StakingToken?.address as Address,
        abi: abis?.StakingToken,
        functionName: 'name',
        chainId: targetChainId,
    });



    const needsApproval = isConnected && allowance !== undefined && !!stakeAmount && ((allowance as unknown as bigint) < parseEther(stakeAmount || '0'));

    const handleApprove = async () => {
        if (!stakeAmount || !contracts?.contracts?.StakingToken?.address) return;
        setIsApproving(true);
        try {
            writeContract({
                abi: abis?.StakingToken,
                address: contracts?.contracts?.StakingToken?.address as Address,
                functionName: 'approve',
                args: [contracts?.contracts?.StakingRewards?.address as Address, parseEther(stakeAmount)],
                chainId: targetChainId,
                chain: undefined,
                account: address
            });

        } catch (error) {
            console.error('Approval error:', error);
            setIsApproving(false);
        }
    };
}