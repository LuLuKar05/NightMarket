import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Portfolio.css';
import Button from '../components/common/Button';
import PrivacyBadge from '../components/market/PrivacyBadge';
import { getPortfolio, getPortfolioHistory, closeBet } from '../services/api';

export default function Portfolio({ isConnected, walletAddress, onConnect }) {
  const [activeTab, setActiveTab] = useState('active');
  const [portfolioData, setPortfolioData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [closingBet, setClosingBet] = useState(null);

  // Fetch portfolio when connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchPortfolio();
    }
  }, [isConnected, walletAddress]);

  // Fetch history when switching to history tab
  useEffect(() => {
    if (activeTab === 'history' && isConnected && walletAddress && !historyData) {
      fetchHistory();
    }
  }, [activeTab, isConnected, walletAddress]);

  const fetchPortfolio = async () => {
    if (!walletAddress) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getPortfolio(walletAddress);
      
      if (response.success) {
        setPortfolioData(response.data);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!walletAddress) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getPortfolioHistory(walletAddress);
      
      if (response.success) {
        setHistoryData(response.data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async (betId) => {
    if (!confirm('Are you sure you want to close this position?')) {
      return;
    }

    try {
      setClosingBet(betId);
      const response = await closeBet(betId);
      
      if (response.success) {
        // Refresh portfolio data
        await fetchPortfolio();
        alert(`Position closed successfully! Final value: ${response.data.finalValue} DUST`);
      }
    } catch (err) {
      console.error('Error closing position:', err);
      alert(err.message || 'Failed to close position');
    } finally {
      setClosingBet(null);
    }
  };

  // Get stats from portfolio data
  const stats = portfolioData?.stats || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalAbsoluteReturn: 0,
    totalReturnPercentage: 0,
    activePositionsCount: 0
  };

  const positions = portfolioData?.positions || [];
  const history = historyData?.history || [];

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
            <span className="stat-number">{stats.totalCurrentValue.toFixed(2)} DUST</span>
            <span className={`stat-change ${stats.totalAbsoluteReturn >= 0 ? 'positive' : 'negative'}`}>
              {stats.totalAbsoluteReturn >= 0 ? '+' : ''}{stats.totalAbsoluteReturn.toFixed(2)} DUST ({stats.totalReturnPercentage}%)
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Σ</div>
          <div className="stat-content">
            <span className="stat-label">TOTAL INVESTED</span>
            <span className="stat-number">{stats.totalInvested.toFixed(2)} DUST</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">#</div>
          <div className="stat-content">
            <span className="stat-label">ACTIVE POSITIONS</span>
            <span className="stat-number">{stats.activePositionsCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">↑</div>
          <div className="stat-content">
            <span className="stat-label">WINNING</span>
            <span className="stat-number positive">{stats.winningPositions || 0}</span>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#ff4444', 
          color: 'white', 
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          Loading your portfolio...
        </div>
      ) : (
        <div className="portfolio-content">
          <div className="portfolio-tabs">
            <button
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Positions ({stats.activePositionsCount})
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History ({historyData?.stats?.totalPositions || 0})
            </button>
          </div>

          <div className="positions-list">
            {activeTab === 'active' ? (
              positions.length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                  <p>No active positions. Start trading on prediction markets!</p>
                  <Link to="/markets">
                    <Button variant="primary">Browse Markets</Button>
                  </Link>
                </div>
              ) : (
                positions.map(position => (
                  <div key={position.id} className="position-card">
                    <div className="position-header">
                      <Link to={`/markets/${position.marketId}`} className="position-title">
                        {position.marketQuestion}
                      </Link>
                      <PrivacyBadge isPrivate={position.isPrivate} />
                    </div>

                    <div className="position-details">
                      <div className="position-outcome">
                        <span className={`outcome-badge outcome-${position.outcome.toLowerCase()}`}>
                          {position.outcome}
                        </span>
                        <span className="shares-count">
                          {position.shares.toFixed(2)} shares @ {position.currentOdds}%
                        </span>
                      </div>

                      <div className="position-stats">
                        <div className="position-stat">
                          <span className="stat-label">Invested</span>
                          <span className="stat-value">{position.invested.toFixed(2)} DUST</span>
                        </div>
                        <div className="position-stat">
                          <span className="stat-label">Current Value</span>
                          <span className="stat-value">{position.currentValue.toFixed(2)} DUST</span>
                        </div>
                        <div className="position-stat">
                          <span className="stat-label">Return</span>
                          <span className={`stat-value ${position.absoluteReturn >= 0 ? 'positive' : 'negative'}`}>
                            {position.absoluteReturn >= 0 ? '+' : ''}{position.absoluteReturn.toFixed(2)} DUST ({position.returnPercentage}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="position-actions">
                      <Link to={`/markets/${position.marketId}`}>
                        <Button variant="ghost" size="small">View Market</Button>
                      </Link>
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleClosePosition(position.id)}
                        disabled={closingBet === position.id}
                      >
                        {closingBet === position.id ? 'Closing...' : 'Close Position'}
                      </Button>
                    </div>
                  </div>
                ))
              )
            ) : (
              // History tab
              history.length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                  <p>No closed positions yet.</p>
                </div>
              ) : (
                history.map(position => (
                  <div key={position.id} className="position-card closed">
                    <div className="position-header">
                      <Link to={`/markets/${position.marketId}`} className="position-title">
                        {position.marketQuestion}
                      </Link>
                      <PrivacyBadge isPrivate={position.isPrivate} />
                    </div>

                    <div className="position-details">
                      <div className="position-outcome">
                        <span className={`outcome-badge outcome-${position.outcome.toLowerCase()}`}>
                          {position.outcome}
                        </span>
                        <span className="shares-count">
                          {position.shares.toFixed(2)} shares @ {position.closingOdds || 'N/A'}%
                        </span>
                      </div>

                      <div className="position-stats">
                        <div className="position-stat">
                          <span className="stat-label">Invested</span>
                          <span className="stat-value">{position.invested.toFixed(2)} DUST</span>
                        </div>
                        <div className="position-stat">
                          <span className="stat-label">Final Value</span>
                          <span className="stat-value">{position.finalValue.toFixed(2)} DUST</span>
                        </div>
                        <div className="position-stat">
                          <span className="stat-label">Return</span>
                          <span className={`stat-value ${position.absoluteReturn >= 0 ? 'positive' : 'negative'}`}>
                            {position.absoluteReturn >= 0 ? '+' : ''}{position.absoluteReturn.toFixed(2)} DUST ({position.returnPercentage}%)
                          </span>
                        </div>
                      </div>

                      <div className="position-meta">
                        <span className="closed-date">
                          Closed: {new Date(position.closedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
