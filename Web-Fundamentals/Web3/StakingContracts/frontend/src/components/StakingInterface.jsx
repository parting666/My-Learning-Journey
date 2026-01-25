import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance, useChainId, useSwitchChain, useEstimateGas, useGasPrice } from 'wagmi';
import { parseEther, formatEther, encodeFunctionData } from 'viem';
import { contracts } from '../config/contracts';
import { abis } from '../config/contracts';
import { polygonAmoy, sepolia, mainnet, hardhat } from 'wagmi/chains';

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
        address: contracts?.contracts?.StakingToken?.address,
        abi: abis?.StakingToken,
        functionName: 'balanceOf',
        args: [address],
        chainId: targetChainId,
        query: { enabled: !!address, refetchInterval: 10_000, retry: false }
    });

    // Read staked balance
    const { data: stakedBalance, refetch: refetchStakedBalance } = useReadContract({
        address: contracts?.contracts?.StakingRewards?.address,
        abi: abis?.StakingRewards,
        functionName: 'stakedBalance',
        args: [address],
        chainId: targetChainId,
        query: { enabled: !!address }
    });

    // Read earned rewards
    const { data: earnedRewards, refetch: refetchEarned } = useReadContract({
        address: contracts?.contracts?.StakingRewards?.address,
        abi: abis?.StakingRewards,
        functionName: 'earned',
        args: [address],
        chainId: targetChainId,
        query: { enabled: !!address }
    });

    // Read total staked
    const { data: totalStaked } = useReadContract({
        address: contracts?.contracts?.StakingRewards?.address,
        abi: abis?.StakingRewards,
        functionName: 'totalStaked',
        chainId: targetChainId,
    });

    // Read allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: contracts?.contracts?.StakingToken?.address,
        abi: abis?.StakingToken,
        functionName: 'allowance',
        args: [address, contracts?.contracts?.StakingRewards?.address],
        chainId: targetChainId,
        query: { enabled: !!address }
    });

    // Read token symbols and names
    const { data: stakingTokenSymbol } = useReadContract({
        address: contracts?.contracts?.StakingToken?.address,
        abi: abis?.StakingToken,
        functionName: 'symbol',
        chainId: targetChainId,
    });

    const { data: rewardsTokenSymbol } = useReadContract({
        address: contracts?.contracts?.RewardsToken?.address,
        abi: abis?.StakingToken,
        functionName: 'symbol',
        chainId: targetChainId,
    });

    const { data: stakingTokenName } = useReadContract({
        address: contracts?.contracts?.StakingToken?.address,
        abi: abis?.StakingToken,
        functionName: 'name',
        chainId: targetChainId,
    });

    // Refetch data after successful transaction
    useEffect(() => {
        if (isSuccess) {
            refetchTokenBalance?.();
            refetchStakedBalance?.();
            refetchEarned?.();
            refetchAllowance?.();
            setStakeAmount('');
            setWithdrawAmount('');
            setIsApproving(false);
        }
    }, [isSuccess]);

    const needsApproval =
        isConnected &&
        !!stakeAmount &&
        (allowance === undefined || allowance < parseEther(stakeAmount || '0'));

    // Gas Estimation
    const { data: gasEstimate } = useEstimateGas({
        account: address,
        to: contracts?.contracts?.StakingRewards?.address,
        data: abis?.StakingRewards && stakeAmount ?
            encodeFunctionData({
                abi: abis.StakingRewards,
                functionName: 'stake',
                args: [parseEther(stakeAmount)]
            }) : undefined,
        chainId: targetChainId,
        query: {
            enabled: !!stakeAmount && !!address && !needsApproval,
        }
    });

    const { data: gasPrice } = useGasPrice({
        chainId: targetChainId,
    });

    const estimatedGasCost = useMemo(() => {
        if (!gasEstimate || !gasPrice) return null;
        const cost = gasEstimate * gasPrice;
        return formatEther(cost);
    }, [gasEstimate, gasPrice]);

    const insufficientGas = useMemo(() => {
        if (!nativeBalance || !estimatedGasCost) return false;
        const have = parseFloat(nativeBalance.formatted);
        const need = parseFloat(estimatedGasCost);
        return have < need;
    }, [nativeBalance, estimatedGasCost]);

    const handleApprove = async () => {
        if (!stakeAmount || !contracts?.contracts?.StakingToken?.address) return;
        setIsApproving(true);
        try {
            await writeContract({
                address: contracts.contracts.StakingToken.address,
                abi: abis.StakingToken,
                functionName: 'approve',
                args: [contracts.contracts.StakingRewards.address, parseEther(stakeAmount)],
                chainId: targetChainId,
            });
        } catch (error) {
            console.error('Approval error:', error);
            setIsApproving(false);
        }
    };

    const handleStake = async () => {
        if (!stakeAmount || !contracts?.contracts?.StakingRewards?.address) return;
        try {
            await writeContract({
                address: contracts.contracts.StakingRewards.address,
                abi: abis.StakingRewards,
                functionName: 'stake',
                args: [parseEther(stakeAmount)],
                chainId: targetChainId,
            });
        } catch (error) {
            console.error('Stake error:', error);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || !contracts?.contracts?.StakingRewards?.address) return;
        try {
            await writeContract({
                address: contracts.contracts.StakingRewards.address,
                abi: abis.StakingRewards,
                functionName: 'withdraw',
                args: [parseEther(withdrawAmount)],
                chainId: targetChainId,
            });
        } catch (error) {
            console.error('Withdraw error:', error);
        }
    };

    const handleClaimRewards = async () => {
        if (!contracts?.contracts?.StakingRewards?.address) return;
        try {
            await writeContract({
                address: contracts.contracts.StakingRewards.address,
                abi: abis.StakingRewards,
                functionName: 'getReward',
                chainId: targetChainId,
            });
        } catch (error) {
            console.error('Claim error:', error);
        }
    };

    const handleExit = async () => {
        if (!contracts?.contracts?.StakingRewards?.address) return;
        try {
            await writeContract({
                address: contracts.contracts.StakingRewards.address,
                abi: abis.StakingRewards,
                functionName: 'exit',
                chainId: targetChainId,
            });
        } catch (error) {
            console.error('Exit error:', error);
        }
    };

    return (
        <div>
            {/* Network Indicator */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                {!isCorrectNetwork && isConnected && (
                    <button
                        onClick={() => switchChain({ chainId: targetChainId })}
                        className="badge"
                        style={{ border: 'none', cursor: 'pointer', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                    >
                        ⚠️ Wrong Network (Switch to Amoy)
                    </button>
                )}
                <span className="badge badge-info" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)' }}>
                    Network: {contracts?.network?.toUpperCase() || 'UNKNOWN'}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {isConnected && (
                    <div className="stat-card">
                        <div className="stat-label">Native Balance</div>
                        <div className="stat-value">
                            {nativeBalance ? parseFloat(nativeBalance.formatted).toFixed(4) : '0.0000'}
                        </div>
                        <div className="stat-subtext">{nativeBalance?.symbol || '...'}</div>
                    </div>
                )}

                {isConnected && (
                    <div className="stat-card">
                        <div className="stat-label">Your Wallet Balance</div>
                        <div className="stat-value">
                            {tokenBalance ? parseFloat(formatEther(tokenBalance)).toFixed(2) : '0.00'}
                        </div>
                        <div className="stat-subtext">{stakingTokenSymbol || '...'} Tokens</div>
                    </div>
                )}

                {isConnected && (
                    <div className="stat-card">
                        <div className="stat-label">Your Staked Balance</div>
                        <div className="stat-value">
                            {stakedBalance ? parseFloat(formatEther(stakedBalance)).toFixed(2) : '0.00'}
                        </div>
                        <div className="stat-subtext">{stakingTokenSymbol || '...'} Tokens</div>
                    </div>
                )}

                {isConnected && (
                    <div className="stat-card">
                        <div className="stat-label">Earned Rewards</div>
                        <div className="stat-value">
                            {earnedRewards ? parseFloat(formatEther(earnedRewards)).toFixed(4) : '0.0000'}
                        </div>
                        <div className="stat-subtext">{rewardsTokenSymbol || '...'} Tokens</div>
                    </div>
                )}

                <div className="stat-card" style={{ gridColumn: isConnected ? 'span 1' : 'span 3' }}>
                    <div className="stat-label">Total Staked (Pool)</div>
                    <div className="stat-value">
                        {totalStaked ? parseFloat(formatEther(totalStaked)).toFixed(2) : '0.00'}
                    </div>
                    <div className="stat-subtext">{stakingTokenSymbol || '...'} Tokens Locked</div>
                </div>
            </div>

            {isConnected ? (
                <>
                    {/* Staking Section */}
                    <div className="card mb-lg">
                        <div className="card-header">
                            <h3 className="card-title">Stake {stakingTokenSymbol || 'Tokens'}</h3>
                            <p className="card-description">Stake your {stakingTokenName || 'tokens'} to earn {rewardsTokenSymbol || 'rewards'}</p>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Amount to Stake</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0.0"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                disabled={isPending || isConfirming}
                            />
                        </div>

                        {needsApproval ? (
                            <button
                                onClick={handleApprove}
                                disabled={isPending || isConfirming || !stakeAmount}
                                className="btn btn-primary btn-full"
                            >
                                {isPending || (isConfirming && isApproving) ? (
                                    <>
                                        <span className="spinner"></span>
                                        Approving...
                                    </>
                                ) : (
                                    `Approve ${stakingTokenSymbol || 'Token'}`
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleStake}
                                disabled={isPending || isConfirming || !stakeAmount}
                                className="btn btn-primary btn-full"
                            >
                                {isPending || (isConfirming && !isApproving) ? (
                                    <>
                                        <span className="spinner"></span>
                                        Staking...
                                    </>
                                ) : (
                                    'Stake Tokens'
                                )}
                            </button>
                        )}
                        {estimatedGasCost && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Estimated Gas: {parseFloat(estimatedGasCost).toFixed(6)} {contracts?.network === 'amoy' ? 'MATIC' : 'ETH'}
                            </div>
                        )}
                        {insufficientGas && (
                            <div className="alert alert-warning" style={{ marginTop: '0.5rem' }}>
                                Not enough MATIC for gas. Please fund your wallet on Amoy.
                            </div>
                        )}
                    </div>

                    {/* Withdraw Section */}
                    <div className="card mb-lg">
                        <div className="card-header">
                            <h3 className="card-title">Withdraw Tokens</h3>
                            <p className="card-description">Unstake your tokens at any time</p>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Amount to Withdraw</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0.0"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                disabled={isPending || isConfirming}
                            />
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={isPending || isConfirming || !withdrawAmount}
                            className="btn btn-secondary btn-full"
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <span className="spinner"></span>
                                    Withdrawing...
                                </>
                            ) : (
                                'Withdraw Tokens'
                            )}
                        </button>
                    </div>

                    {/* Rewards Section */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Manage Rewards</h3>
                            <p className="card-description">Claim your earned rewards or exit completely</p>
                        </div>

                        <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                            <button
                                onClick={handleClaimRewards}
                                disabled={isPending || isConfirming || !earnedRewards}
                                className="btn btn-success"
                                style={{ flex: '1', minWidth: '200px' }}
                            >
                                {isPending || isConfirming ? (
                                    <>
                                        <span className="spinner"></span>
                                        Claiming...
                                    </>
                                ) : (
                                    'Claim Rewards'
                                )}
                            </button>

                            <button
                                onClick={handleExit}
                                disabled={isPending || isConfirming || !stakedBalance}
                                className="btn btn-secondary"
                                style={{ flex: '1', minWidth: '200px' }}
                            >
                                {isPending || isConfirming ? (
                                    <>
                                        <span className="spinner"></span>
                                        Exiting...
                                    </>
                                ) : (
                                    'Exit (Withdraw All + Claim)'
                                )}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Welcome to Staking DApp</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                        Connect your wallet to get started with staking and earning rewards on {contracts?.network?.toUpperCase() || 'the network'}.
                    </p>

                    <div className="stats-grid" style={{ marginTop: 'var(--spacing-xl)' }}>
                        <div className="stat-card">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>💰</div>
                            <div className="stat-label">Stake Tokens</div>
                        </div>
                        <div className="stat-card">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📈</div>
                            <div className="stat-label">Earn Rewards</div>
                        </div>
                        <div className="stat-card">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🔓</div>
                            <div className="stat-label">Withdraw Anytime</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Status */}
            {hash && (
                <div className={`alert ${isConfirming ? 'alert-info' : 'alert-success'} mt-lg`}>
                    {isConfirming ? (
                        <>
                            <span className="spinner"></span>
                            <span style={{ marginLeft: '0.5rem' }}>Waiting for confirmation...</span>
                        </>
                    ) : (
                        <>✓ Transaction confirmed!</>
                    )}
                </div>
            )}
        </div>
    );
}
