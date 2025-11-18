import { useState, useEffect } from 'react';
import './Staking.css';

function Staking({ isConnected, onConnect }) {
  const [stakedAmount, setStakedAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(1000);
  const [stakeInput, setStakeInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [rewards, setRewards] = useState(0);

  // Mock APY
  const APY = 12.5;

  useEffect(() => {
    // Simulate rewards accumulation
    if (stakedAmount > 0) {
      const interval = setInterval(() => {
        setRewards(prev => prev + (stakedAmount * APY / 100 / 365 / 24 / 60 / 60));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stakedAmount]);

  const handleStake = () => {
    const amount = parseFloat(stakeInput);
    if (amount > 0 && amount <= availableBalance) {
      setStakedAmount(prev => prev + amount);
      setAvailableBalance(prev => prev - amount);
      setStakeInput('');
    }
  };

  const handleUnstake = () => {
    const amount = parseFloat(unstakeInput);
    if (amount > 0 && amount <= stakedAmount) {
      setStakedAmount(prev => prev - amount);
      setAvailableBalance(prev => prev + amount);
      setUnstakeInput('');
    }
  };

  const handleClaimRewards = () => {
    setAvailableBalance(prev => prev + rewards);
    setRewards(0);
  };

  if (!isConnected) {
    return (
      <div className="staking-page">
        <div className="connect-prompt">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to access staking features</p>
          <button className="connect-button" onClick={onConnect}>
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staking-page">
      <div className="staking-header">
        <h1>Staking</h1>
        <p>Stake your tokens to earn rewards and participate in governance</p>
      </div>

      <div className="staking-stats">
        <div className="stat-card">
          <div className="stat-label">Available Balance</div>
          <div className="stat-value">{availableBalance.toFixed(2)} NMT</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Staked Amount</div>
          <div className="stat-value">{stakedAmount.toFixed(2)} NMT</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current APY</div>
          <div className="stat-value">{APY}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Rewards</div>
          <div className="stat-value">{rewards.toFixed(6)} NMT</div>
        </div>
      </div>

      <div className="staking-actions">
        <div className="action-card">
          <h3>Stake Tokens</h3>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount to stake"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              min="0"
              max={availableBalance}
            />
            <button onClick={handleStake} disabled={!stakeInput || parseFloat(stakeInput) <= 0}>
              Stake
            </button>
          </div>
        </div>

        <div className="action-card">
          <h3>Unstake Tokens</h3>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount to unstake"
              value={unstakeInput}
              onChange={(e) => setUnstakeInput(e.target.value)}
              min="0"
              max={stakedAmount}
            />
            <button onClick={handleUnstake} disabled={!unstakeInput || parseFloat(unstakeInput) <= 0}>
              Unstake
            </button>
          </div>
        </div>

        <div className="action-card">
          <h3>Claim Rewards</h3>
          <p className="rewards-info">You have earned {rewards.toFixed(6)} NMT in rewards</p>
          <button 
            className="claim-button" 
            onClick={handleClaimRewards}
            disabled={rewards <= 0}
          >
            Claim Rewards
          </button>
        </div>
      </div>

      <div className="staking-info">
        <h3>How Staking Works</h3>
        <ul>
          <li>Stake your NMT tokens to earn passive rewards</li>
          <li>Rewards are calculated based on the current APY</li>
          <li>You can unstake your tokens at any time</li>
          <li>Staked tokens contribute to network security and governance</li>
        </ul>
      </div>
    </div>
  );
}

export default Staking;
