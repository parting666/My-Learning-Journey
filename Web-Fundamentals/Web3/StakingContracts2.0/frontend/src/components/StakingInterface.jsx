import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance, useChainId, useSwitchChain, useEstimateGas, useGasPrice } from 'wagmi';
import { parseEther, formatEther, encodeFunctionData, parseEventLogs } from 'viem';
import { contracts } from '../config/contracts';
import { abis } from '../config/contracts';
import { polygonAmoy, sepolia, mainnet, hardhat } from 'wagmi/chains';
import useStakingInfo from '../hooks/useStakingBalance';


export default function StakingInterface() {
    const [tokenType, setTokenType] = useState('ERC20');
    const [customPoolAddress, setCustomPoolAddress] = useState('');
    const [newTokenAddress, setNewTokenAddress] = useState('');
    const [rewardRate, setRewardRate] = useState('0.1');
    const [createdPoolAddress, setCreatedPoolAddress] = useState('');
    const [isCreatingPool, setIsCreatingPool] = useState(false);
    const [fundAmount, setFundAmount] = useState('1000');
    const [activeActionTab, setActiveActionTab] = useState('stake');

    const {
        isConnected,
        tokenBalance,
        stakedBalance,
        earnedRewards,
        poolRewardBalance,
        isApproving,
        isPending,
        isConfirming,
        isSuccess,
        isFunding,
        needsApproval,
        tokenId,
        setTokenId,
        stakeAmount,
        setStakeAmount,
        withdrawAmount,
        setWithdrawAmount,
        handleApprove,
        handleStake,
        handleWithdraw,
        handleClaimRewards,
        handleMint,
        handleCreatePool,
        handleFundPool,
        receipt,
        currentChainId,
        targetChainName,
        hash
    } = useStakingInfo(customPoolAddress || undefined, tokenType);

    const isUnderfunded = earnedRewards > 0n && poolRewardBalance != null && earnedRewards > poolRewardBalance;

    const safeFormatEther = (val) => {
        if (!val || typeof val !== 'bigint') return '0.00';
        try {
            return formatEther(val);
        } catch (e) {
            return '0.00';
        }
    };

    // Handle pool creation success parsing
    useEffect(() => {
        if (receipt && isCreatingPool) {
            try {
                const logs = parseEventLogs({
                    abi: abis.StakingFactory,
                    eventName: 'StakingPoolCreated',
                    logs: receipt.logs,
                });

                if (logs && logs.length > 0) {
                    const newPoolAddress = logs[0].args.stakingContract;
                    setCreatedPoolAddress(newPoolAddress);
                    setCustomPoolAddress(newPoolAddress);
                    setIsCreatingPool(false);
                }
            } catch (err) {
                console.error("Error parsing creation logs:", err);
                setIsCreatingPool(false);
            }
        }
    }, [receipt, isCreatingPool]);

    const handleCreateWrapper = async (addr, rate) => {
        setIsCreatingPool(true);
        setCreatedPoolAddress('');
        handleCreatePool(addr, rate);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {/* Top Row: Prominent Stats */}
            {isConnected ? (
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
                    <div className="stat-card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div className="stat-label" style={{ fontSize: '1rem' }}>Wallet Balance</div>
                        <div className="stat-value" style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>
                            {tokenType === 'ERC20'
                                ? parseFloat(safeFormatEther(tokenBalance)).toFixed(2)
                                : (tokenBalance != null ? tokenBalance.toString() : '0')}
                        </div>
                        <div className="stat-subtext" style={{ fontSize: '1rem' }}>{tokenType} Assets</div>
                    </div>
                    <div className="stat-card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div className="stat-label" style={{ fontSize: '1rem' }}>Staked {tokenType === 'ERC20' ? 'Balance' : 'Count'}</div>
                        <div className="stat-value" style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>
                            {stakedBalance != null
                                ? (tokenType === 'ERC20' ? parseFloat(safeFormatEther(stakedBalance)).toFixed(2) : stakedBalance.toString())
                                : '0'}
                        </div>
                        <div className="stat-subtext" style={{ fontSize: '1rem' }}>Active Staking</div>
                    </div>
                    <div className="stat-card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center', position: 'relative' }}>
                        <div className="stat-label" style={{ fontSize: '1rem' }}>Unclaimed Rewards</div>
                        <div className="stat-value" style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: isUnderfunded ? 'var(--error)' : 'var(--success)' }}>
                            {earnedRewards != null ? parseFloat(safeFormatEther(earnedRewards)).toFixed(6) : '0.000000'}
                        </div>
                        <button
                            onClick={handleClaimRewards}
                            disabled={isPending || isConfirming || !earnedRewards || isUnderfunded}
                            className={`btn ${isUnderfunded ? 'btn-outline' : 'btn-success'}`}
                            style={{ position: 'absolute', bottom: 'var(--spacing-md)', right: 'var(--spacing-md)', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            title={isUnderfunded ? "Pool has insufficient funds to pay your rewards" : ""}
                        >
                            {isPending || (isConfirming && !isApproving && !isFunding && !isCreatingPool) ? '...' : (isUnderfunded ? 'Pool Empty' : 'Claim PRT')}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                    <h2 style={{ margin: 0 }}>Connect Wallet to Access Dashboard</h2>
                </div>
            )}

            {/* Middle Row: Selection & Actions */}
            {/* Actions Hub and Configuration Container */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--spacing-lg)', alignItems: 'start' }}>
                {/* Left Side: Staking Pool Info */}
                <div className="card" style={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header" style={{ paddingBottom: 'var(--spacing-sm)' }}>
                        <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Staking Pool Info</h3>
                    </div>

                    <div className="flex flex-col gap-md" style={{ flex: 1 }}>
                        <div className="input-group">
                            <label className="input-label">Project Assets</label>
                            <div className="flex gap-sm">
                                {['ERC20', 'ERC721', 'ERC1155'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setTokenType(type)}
                                        className={`btn ${tokenType === type ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Active Pool Address</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Default Test Pool"
                                value={customPoolAddress}
                                onChange={(e) => setCustomPoolAddress(e.target.value)}
                                style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                            />
                            <div className="badge badge-info mt-sm" style={{ width: '100%', textAlign: 'center', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)', padding: '0.5rem' }}>
                                {(targetChainName || 'Loading...').toUpperCase()} ({currentChainId || '...'})
                            </div>
                        </div>

                        {/* Funding UI */}
                        <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div className="flex justify-between items-center mb-sm">
                                <label className="input-label" style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Rewards Pool Fund</label>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: poolRewardBalance === 0n ? 'var(--error)' : 'var(--success)' }}>
                                    {parseFloat(safeFormatEther(poolRewardBalance)).toFixed(2)} PRT
                                </span>
                            </div>
                            <div className="input-with-button">
                                <input
                                    type="number"
                                    className="input"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                                />
                                <button
                                    onClick={() => handleFundPool(fundAmount)}
                                    disabled={isPending || isConfirming || !fundAmount}
                                    className="btn btn-secondary"
                                    style={{ padding: '0 1rem', fontSize: '0.85rem' }}
                                >
                                    {isFunding ? '...' : 'Fund'}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.7rem', marginTop: '8px', opacity: 0.5, lineHeight: 1.4 }}>
                                New pools start empty. Fund it to enable reward distributions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Action Hub with Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    <div className="card action-hub">
                        <div className="tabs-container">
                            <button
                                className={`tab-item ${activeActionTab === 'stake' ? 'active' : ''}`}
                                onClick={() => setActiveActionTab('stake')}
                            >
                                Stake {tokenType}
                            </button>
                            <button
                                className={`tab-item ${activeActionTab === 'withdraw' ? 'active' : ''}`}
                                onClick={() => setActiveActionTab('withdraw')}
                            >
                                Withdraw Assets
                            </button>
                        </div>

                        {activeActionTab === 'stake' ? (
                            <div className="flex flex-col gap-md fade-in" key="stake-tab">
                                {tokenType !== 'ERC20' && (
                                    <div className="input-group">
                                        <label className="input-label">Token ID</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="Enter ID"
                                            min="0"
                                            value={tokenId}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || parseInt(val) >= 0) setTokenId(val);
                                            }}
                                            disabled={isPending || isConfirming}
                                        />
                                    </div>
                                )}
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label className="input-label">
                                        {tokenType === 'ERC20' ? 'Staking Amount' : 'Quantity'}
                                    </label>
                                    <div className="input-with-button">
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="0.0"
                                            min="0"
                                            value={stakeAmount}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || parseFloat(val) >= 0) setStakeAmount(val);
                                            }}
                                            disabled={isPending || isConfirming || tokenType === 'ERC721'}
                                        />
                                        {tokenType === 'ERC20' && (
                                            <button
                                                onClick={handleMint}
                                                disabled={isPending || isConfirming}
                                                className="btn btn-secondary"
                                                title="Get test tokens"
                                                style={{ padding: '0 1rem' }}
                                            >
                                                {isPending ? '...' : 'Get'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                                    {needsApproval ? (
                                        <button onClick={handleApprove} disabled={isPending || isConfirming || (tokenType !== 'ERC721' && !stakeAmount)} className="btn btn-primary btn-full">
                                            {isPending || (isConfirming && isApproving) ? 'Approving...' : `Approve ${tokenType}`}
                                        </button>
                                    ) : (
                                        <button onClick={handleStake} disabled={isPending || isConfirming || (!stakeAmount && tokenType !== 'ERC721')} className="btn btn-primary btn-full">
                                            {isPending || (isConfirming && !isApproving) ? 'Deposit Assets' : `Confirm Stake`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-md fade-in" key="withdraw-tab">
                                {tokenType !== 'ERC20' && (
                                    <div className="input-group">
                                        <label className="input-label">Token ID</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="Enter ID"
                                            min="0"
                                            value={tokenId}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || parseInt(val) >= 0) setTokenId(val);
                                            }}
                                            disabled={isPending || isConfirming}
                                        />
                                    </div>
                                )}
                                <div className="input-group">
                                    <label className="input-label">
                                        {tokenType === 'ERC20' ? 'Withdraw Amount' : 'Quantity'}
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="0.0"
                                        min="0"
                                        value={withdrawAmount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || parseFloat(val) >= 0) setWithdrawAmount(val);
                                        }}
                                        disabled={isPending || isConfirming}
                                    />
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                                    <button onClick={handleWithdraw} disabled={isPending || isConfirming || !withdrawAmount} className="btn btn-secondary btn-full">
                                        {isPending || (isConfirming && !isCreatingPool) ? 'Processing...' : 'Request Withdrawal'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Create Pool: Advanced */}
                    <div className="card">
                        <div className="card-header">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="card-title">Setup New Staking Pool</h3>
                                    <p className="card-description" style={{ marginBottom: 0 }}>Deploy a custom pool for any {tokenType} token</p>
                                </div>
                                <div className="badge badge-warning">Advanced</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-md">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label className="input-label">Staking Token Address</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="0x..."
                                        value={newTokenAddress}
                                        onChange={(e) => setNewTokenAddress(e.target.value)}
                                        style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label className="input-label">Reward Rate (per sec)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="0.1"
                                        min="0"
                                        value={rewardRate}
                                        onChange={(e) => setRewardRate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => handleCreateWrapper(newTokenAddress, rewardRate)}
                                disabled={isPending || isConfirming || !newTokenAddress}
                                className="btn btn-primary btn-full"
                            >
                                {isPending || (isConfirming && isCreatingPool) ? 'Deploying...' : `🚀 Launch ${tokenType} Staking Pool`}
                            </button>
                            {createdPoolAddress && (
                                <div className="alert alert-success mt-sm" style={{ margin: 0 }}>
                                    <div className="flex items-center gap-sm">
                                        <span>🎉 <strong>Success!</strong> Your new pool is live at:</span>
                                        <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{createdPoolAddress}</code>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {hash && (
                <div className={`alert ${isConfirming ? 'alert-info' : 'alert-success'} mt-lg`} style={{ textAlign: 'center' }}>
                    {isConfirming ? '⚙️ Transaction pending in the clouds...' : '✅ Transaction completed successfully!'}
                </div>
            )}
        </div>
    );
}

