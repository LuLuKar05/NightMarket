import { useState } from 'react';
import './Liquidity.css';
import ConnectWalletPrompt from '../components/common/ConnectWalletPrompt';

function Liquidity({ isConnected, onConnect }) {
  const [pools, setPools] = useState([
    {
      id: 1,
      name: 'NIGHT/USDC',
      tokenA: 'NIGHT',
      tokenB: 'USDC',
      tvl: 125000,
      apr: 18.5,
      userLiquidity: 5000,
      userShare: 4.0
    },
    {
      id: 2,
      name: 'NIGHT/ETH',
      tokenA: 'NIGHT',
      tokenB: 'ETH',
      tvl: 85000,
      apr: 22.3,
      userLiquidity: 0,
      userShare: 0
    },
    {
      id: 3,
      name: 'NIGHT/BTC',
      tokenA: 'NIGHT',
      tokenB: 'BTC',
      tvl: 200000,
      apr: 15.8,
      userLiquidity: 10000,
      userShare: 5.0
    }
  ]);

  const [selectedPool, setSelectedPool] = useState(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [removeAmount, setRemoveAmount] = useState('');

  const handleAddLiquidity = () => {
    if (selectedPool && amountA && amountB) {
      const updatedPools = pools.map(pool => {
        if (pool.id === selectedPool.id) {
          const addedLiquidity = parseFloat(amountA) + parseFloat(amountB);
          return {
            ...pool,
            userLiquidity: pool.userLiquidity + addedLiquidity,
            tvl: pool.tvl + addedLiquidity,
            userShare: ((pool.userLiquidity + addedLiquidity) / (pool.tvl + addedLiquidity)) * 100
          };
        }
        return pool;
      });
      setPools(updatedPools);
      setAmountA('');
      setAmountB('');
      setSelectedPool(null);
    }
  };

  const handleRemoveLiquidity = () => {
    if (selectedPool && removeAmount) {
      const updatedPools = pools.map(pool => {
        if (pool.id === selectedPool.id) {
          const removedAmount = parseFloat(removeAmount);
          return {
            ...pool,
            userLiquidity: Math.max(0, pool.userLiquidity - removedAmount),
            tvl: Math.max(0, pool.tvl - removedAmount),
            userShare: ((pool.userLiquidity - removedAmount) / (pool.tvl - removedAmount)) * 100
          };
        }
        return pool;
      });
      setPools(updatedPools);
      setRemoveAmount('');
      setSelectedPool(null);
    }
  };

  if (!isConnected) {
    return (
      <div className="liquidity-page">
        <ConnectWalletPrompt 
          onConnect={onConnect}
          title="Connect Your Wallet"
          subtitle="Connect your Lace wallet to provide liquidity and earn trading fees"
        />
      </div>
    );
  }

  return (
    <div className="liquidity-page">
      <div className="liquidity-header">
        <h1>Liquidity Pools</h1>
        <p>Provide liquidity to earn trading fees and rewards</p>
      </div>

      <div className="liquidity-overview">
        <div className="overview-card">
          <div className="overview-label">Total Value Locked</div>
          <div className="overview-value">
            ${pools.reduce((sum, pool) => sum + pool.tvl, 0).toLocaleString()}
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-label">Your Total Liquidity</div>
          <div className="overview-value">
            ${pools.reduce((sum, pool) => sum + pool.userLiquidity, 0).toLocaleString()}
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-label">Active Pools</div>
          <div className="overview-value">{pools.length}</div>
        </div>
      </div>

      <div className="pools-grid">
        {pools.map(pool => (
          <div key={pool.id} className="pool-card">
            <div className="pool-header">
              <h3>{pool.name}</h3>
              <div className="pool-apr">APR: {pool.apr}%</div>
            </div>
            <div className="pool-stats">
              <div className="pool-stat">
                <span className="stat-label">TVL</span>
                <span className="stat-value">${pool.tvl.toLocaleString()}</span>
              </div>
              <div className="pool-stat">
                <span className="stat-label">Your Liquidity</span>
                <span className="stat-value">${pool.userLiquidity.toLocaleString()}</span>
              </div>
              <div className="pool-stat">
                <span className="stat-label">Your Share</span>
                <span className="stat-value">{pool.userShare.toFixed(2)}%</span>
              </div>
            </div>
            <div className="pool-actions">
              <button 
                className="add-liquidity-btn"
                onClick={() => setSelectedPool(pool)}
              >
                {pool.userLiquidity > 0 ? 'Add More' : 'Add Liquidity'}
              </button>
              {pool.userLiquidity > 0 && (
                <button 
                  className="remove-liquidity-btn"
                  onClick={() => setSelectedPool(pool)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPool && (
        <div className="modal-overlay" onClick={() => setSelectedPool(null)}>
          <div className="liquidity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPool.name} Pool</h2>
              <button className="close-btn" onClick={() => setSelectedPool(null)}>×</button>
            </div>
            
            <div className="modal-tabs">
              <div className="add-liquidity-section">
                <h3>Add Liquidity</h3>
                <div className="input-group">
                  <label>{selectedPool.tokenA} Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>{selectedPool.tokenB} Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                  />
                </div>
                <button 
                  className="action-btn"
                  onClick={handleAddLiquidity}
                  disabled={!amountA || !amountB}
                >
                  Add Liquidity
                </button>
              </div>

              {selectedPool.userLiquidity > 0 && (
                <div className="remove-liquidity-section">
                  <h3>Remove Liquidity</h3>
                  <div className="input-group">
                    <label>Amount to Remove (USD)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={removeAmount}
                      onChange={(e) => setRemoveAmount(e.target.value)}
                      max={selectedPool.userLiquidity}
                    />
                  </div>
                  <button 
                    className="action-btn remove"
                    onClick={handleRemoveLiquidity}
                    disabled={!removeAmount || parseFloat(removeAmount) > selectedPool.userLiquidity}
                  >
                    Remove Liquidity
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="liquidity-info">
        <h3>About Liquidity Pools</h3>
        <ul>
          <li>Earn trading fees by providing liquidity to pools</li>
          <li>Your liquidity is represented by LP tokens</li>
          <li>APR includes trading fees and additional rewards</li>
          <li>Impermanent loss may occur when token prices diverge</li>
          <li>You can withdraw your liquidity at any time</li>
        </ul>
      </div>
    </div>
  );
}

export default Liquidity;
