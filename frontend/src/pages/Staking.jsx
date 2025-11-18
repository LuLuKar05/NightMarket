import { useState, useEffect } from 'react';
import './Staking.css';

function Staking({ isConnected, onConnect }) {
  const [stakedNight, setStakedNight] = useState(0);
  const [availableNight, setAvailableNight] = useState(1000);
  const [dustBalance, setDustBalance] = useState(0);
  const [stakeInput, setStakeInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [earnedDust, setEarnedDust] = useState(0);

  // APY for DUST interest rewards on staked NIGHT
  const APY = 12.5;
  // Display daily interest rate for clarity
  const DAILY_RATE = (APY / 365).toFixed(4);

  useEffect(() => {
    // Accumulate DUST interest rewards from staked NIGHT
    if (stakedNight > 0) {
      const interval = setInterval(() => {
        // Calculate DUST interest per second based on staked NIGHT
        const dustPerSecond = (stakedNight * APY / 100 / 365 / 24 / 60 / 60);
        setEarnedDust(prev => prev + dustPerSecond);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stakedNight]);

  const handleStake = () => {
    const amount = parseFloat(stakeInput);
    if (amount > 0 && amount <= availableNight) {
      setStakedNight(prev => prev + amount);
      setAvailableNight(prev => prev - amount);
      setStakeInput('');
    }
  };

  const handleUnstake = () => {
    const amount = parseFloat(unstakeInput);
    if (amount > 0 && amount <= stakedNight) {
      setStakedNight(prev => prev - amount);
      setAvailableNight(prev => prev + amount);
      setUnstakeInput('');
    }
  };

  const handleClaimRewards = () => {
    setDustBalance(prev => prev + earnedDust);
    setEarnedDust(0);
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
        <h1>🌙 NIGHT Token Staking</h1>
        <p className="staking-subtitle">Lock NIGHT tokens as collateral and earn DUST interest rewards</p>
      </div>

      <div className="staking-explanation">
        <div className="explanation-card">
          <h3>💎 How NIGHT Staking Works</h3>
          <div className="explanation-content">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-text">
                <strong>Stake NIGHT as Collateral</strong>
                <p>Lock your NIGHT tokens - they remain yours as collateral</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-text">
                <strong>Earn DUST as Interest</strong>
                <p>Receive DUST tokens as interest at {APY}% APY ({DAILY_RATE}% daily)</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-text">
                <strong>Trade with DUST</strong>
                <p>Use earned DUST to trade on prediction markets</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <div className="step-text">
                <strong>Unstake Anytime</strong>
                <p>Withdraw your NIGHT collateral whenever you want</p>
              </div>
            </div>
          </div>
        </div>

        <div className="comparison-banner">
          <div className="comparison-icon">🚀</div>
          <div className="comparison-content">
            <h4>Earn More on NightMarket!</h4>
            <div className="comparison-rates">
              <div className="rate-item">
                <span className="rate-label">Regular Midnight Network Staking:</span>
                <span className="rate-value old">~5-8% APY</span>
              </div>
              <div className="rate-divider">→</div>
              <div className="rate-item highlighted">
                <span className="rate-label">NightMarket Staking:</span>
                <span className="rate-value new">{APY}% APY</span>
                <span className="rate-boost">+{(APY - 6.5).toFixed(1)}% BONUS</span>
              </div>
            </div>
            <p className="comparison-note">
              💡 Stake on NightMarket to earn up to 2x more DUST interest compared to standard Midnight Network staking rewards!
            </p>
          </div>
        </div>
      </div>

      <div className="staking-stats">
        <div className="stat-card">
          <div className="stat-icon">🌙</div>
          <div className="stat-content">
            <div className="stat-label">Available NIGHT</div>
            <div className="stat-value">{availableNight.toFixed(2)} NIGHT</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <div className="stat-label">Staked NIGHT (Collateral)</div>
            <div className="stat-value">{stakedNight.toFixed(2)} NIGHT</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <div className="stat-label">DUST Balance</div>
            <div className="stat-value">{dustBalance.toFixed(2)} DUST</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Interest APY</div>
            <div className="stat-value">{APY}%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-content">
            <div className="stat-label">DUST Interest Earned</div>
            <div className="stat-value">{earnedDust.toFixed(4)} DUST</div>
          </div>
        </div>
      </div>

      <div className="staking-actions">
        <div className="action-card stake-card">
          <h3>Stake NIGHT as Collateral</h3>
          <p className="action-description">
            Lock your NIGHT tokens to start earning DUST interest rewards at {APY}% APY
          </p>
          <div className="conversion-preview">
            {stakeInput && parseFloat(stakeInput) > 0 && (
              <div className="conversion-info">
                Staking {parseFloat(stakeInput).toFixed(2)} NIGHT will earn ~<strong>{(parseFloat(stakeInput) * APY / 100 / 365).toFixed(4)} DUST daily</strong>
              </div>
            )}
          </div>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount of NIGHT to stake"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              min="0"
              max={availableNight}
              step="0.01"
            />
            <button 
              onClick={handleStake} 
              disabled={!stakeInput || parseFloat(stakeInput) <= 0 || parseFloat(stakeInput) > availableNight}
              className="stake-button"
            >
              Stake NIGHT
            </button>
          </div>
        </div>

        <div className="action-card unstake-card">
          <h3>Unstake NIGHT</h3>
          <p className="action-description">
            Withdraw your NIGHT collateral anytime - your earned DUST remains yours
          </p>
          <div className="conversion-preview">
            {unstakeInput && parseFloat(unstakeInput) > 0 && (
              <div className="conversion-info success">
                Returns <strong>{parseFloat(unstakeInput).toFixed(2)} NIGHT</strong> to your wallet
              </div>
            )}
          </div>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount of NIGHT to unstake"
              value={unstakeInput}
              onChange={(e) => setUnstakeInput(e.target.value)}
              min="0"
              max={stakedNight}
              step="0.01"
            />
            <button 
              onClick={handleUnstake} 
              disabled={!unstakeInput || parseFloat(unstakeInput) <= 0 || parseFloat(unstakeInput) > stakedNight}
              className="unstake-button"
            >
              Unstake NIGHT
            </button>
          </div>
        </div>

        <div className="action-card rewards-card">
          <h3>Claim DUST Interest</h3>
          <p className="action-description">
            Claim your accumulated DUST interest rewards from staking
          </p>
          <div className="rewards-display">
            <div className="rewards-amount">{earnedDust.toFixed(6)} DUST</div>
            <div className="rewards-label">Interest Earned & Ready to Claim</div>
          </div>
          <button 
            className="claim-button" 
            onClick={handleClaimRewards}
            disabled={earnedDust <= 0}
          >
            Claim DUST Interest
          </button>
        </div>
      </div>

      <div className="staking-info">
        <h3>📚 About NIGHT Staking & DUST Interest</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>🪙 Collateral-Based System</strong>
            <p>Your staked NIGHT tokens remain yours as collateral. We don't exchange them - they're locked to secure your position while you earn DUST interest.</p>
          </div>
          <div className="info-item">
            <strong>� DUST as Interest</strong>
            <p>DUST tokens are earned as interest rewards at {APY}% APY. This is like taking a loan against your NIGHT collateral, where DUST is the benefit you receive.</p>
          </div>
          <div className="info-item">
            <strong>🎯 Use DUST for Trading</strong>
            <p>DUST is the utility token for NightMarket. Use it to place bets on prediction markets, create markets, and provide liquidity.</p>
          </div>
          <div className="info-item">
            <strong>📊 Continuous Interest</strong>
            <p>Earn {DAILY_RATE}% daily ({APY}% APY) in DUST tokens. Interest accumulates continuously every second and can be claimed anytime.</p>
          </div>
          <div className="info-item">
            <strong>🔓 Flexible Unstaking</strong>
            <p>Unstake your NIGHT collateral anytime with no penalties. Your earned DUST interest stays in your wallet - it's yours to keep and use.</p>
          </div>
          <div className="info-item">
            <strong>🛡️ Secure & Private</strong>
            <p>All staking operations are secured by Midnight Network's zero-knowledge proof technology, ensuring your financial privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
