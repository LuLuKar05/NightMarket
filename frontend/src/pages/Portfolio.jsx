import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Portfolio.css';
import Button from '../components/common/Button';
import PrivacyBadge from '../components/market/PrivacyBadge';
// import { getPositions } from '../services/api'; // TODO: Uncomment when positions endpoint is ready

export default function Portfolio({ isConnected, onConnect }) {
  const [activeTab, setActiveTab] = useState('active');
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Replace with real API call when positions endpoint is ready
  // For now, using mock data
  useEffect(() => {
    if (isConnected) {
      // fetchPositions();
      loadMockPositions();
    }
  }, [isConnected]);

  const loadMockPositions = () => {
    // Mock portfolio data (will be replaced with API call)
    const mockPositions = [
      {
        id: 1,
        marketId: 1,
        question: 'Will Bitcoin reach $100,000 by end of 2025?',
        outcome: 'YES',
        shares: 750,
        invested: 500,
        currentValue: 620,
        isPrivate: true
      },
      {
        id: 2,
        marketId: 2,
        question: 'Will Ethereum implement sharding in Q1 2026?',
        outcome: 'NO',
        shares: 300,
        invested: 300,
        currentValue: 270,
        isPrivate: false
      }
    ];
    setPositions(mockPositions);
  };

  /* TODO: Uncomment when positions endpoint is ready
  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get wallet address from props or context
      const walletAddress = 'USER_WALLET_ADDRESS'; // Replace with actual wallet address
      
      const response = await getPositions(walletAddress);
      
      if (response.success) {
        setPositions(response.data);
      }
    } catch (err) {
      console.error('Error fetching positions:', err);
      setError(err.message || 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  };
  */

  const totalInvested = positions.reduce((sum, p) => sum + p.invested, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalReturn = totalValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : 0;

  if (!isConnected) {
    return (
      <div className="portfolio-page">
        <div className="portfolio-header">
          <h1>My Portfolio</h1>
          <div className="wallet-status">
            <span>Not connected</span>
          </div>
        </div>

        <div className="empty-state">
          <p>Please connect your Lace wallet to view your portfolio.</p>
          <div>
            <button className="btn btn-primary btn-medium" onClick={onConnect}>
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h1>My Portfolio</h1>
        <div className="wallet-status">
          <span>Connected: ...</span>
        </div>
      </div>

      <div className="portfolio-stats">
        <div className="stat-card">
          <div className="stat-icon">$</div>
          <div className="stat-content">
            <span className="stat-label">TOTAL VALUE</span>
            <span className="stat-number">{totalValue} DUST</span>
            <span className={`stat-change ${totalReturn >= 0 ? 'positive' : 'negative'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)} DUST ({returnPercentage}%)
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Σ</div>
          <div className="stat-content">
            <span className="stat-label">TOTAL INVESTED</span>
            <span className="stat-number">{totalInvested} DUST</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">#</div>
          <div className="stat-content">
            <span className="stat-label">ACTIVE POSITIONS</span>
            <span className="stat-number">{positions.length}</span>
          </div>
        </div>
      </div>

      <div className="portfolio-content">
        <div className="portfolio-tabs">
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Positions
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        <div className="positions-list">
          {positions.map(position => {
            const gainLoss = position.currentValue - position.invested;
            const gainLossPercentage = ((gainLoss / position.invested) * 100).toFixed(2);

            return (
              <div key={position.id} className="position-card">
                <div className="position-header">
                  <Link to={`/markets/${position.marketId}`} className="position-title">
                    {position.question}
                  </Link>
                  <PrivacyBadge isPrivate={position.isPrivate} />
                </div>

                <div className="position-details">
                  <div className="position-outcome">
                    <span className={`outcome-badge outcome-${position.outcome.toLowerCase()}`}>
                      {position.outcome}
                    </span>
                    <span className="shares-count">{position.shares} shares</span>
                  </div>

                  <div className="position-stats">
                    <div className="position-stat">
                      <span className="stat-label">Invested</span>
                      <span className="stat-value">{position.invested} DUST</span>
                    </div>
                    <div className="position-stat">
                      <span className="stat-label">Current Value</span>
                      <span className="stat-value">{position.currentValue} DUST</span>
                    </div>
                    <div className="position-stat">
                      <span className="stat-label">Return</span>
                      <span className={`stat-value ${gainLoss >= 0 ? 'positive' : 'negative'}`}>
                        {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(2)} DUST ({gainLossPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="position-actions">
                  <Link to={`/markets/${position.marketId}`}>
                    <Button variant="ghost" size="small">View Market</Button>
                  </Link>
                  <Button variant="danger" size="small">Close Position</Button>
                </div>
              </div>
            );
          })}
        </div>

        {positions.length === 0 && (
          <div className="empty-state">
            <p>No active positions</p>
            <Link to="/markets">
              <Button variant="primary">Explore Markets</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
