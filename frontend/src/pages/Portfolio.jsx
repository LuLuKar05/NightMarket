import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Portfolio.css';
import Button from '../components/common/Button';
import PrivacyBadge from '../components/market/PrivacyBadge';
import { getBets } from '../services/api';

export default function Portfolio({ isConnected, walletAddress, onConnect }) {
  const [activeTab, setActiveTab] = useState('active');
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bets when connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchBets();
    }
  }, [isConnected, walletAddress]);

  const fetchBets = async () => {
    if (!walletAddress) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getBets({ wallet: walletAddress });
      
      if (response.success) {
        setBets(response.data);
      }
    } catch (err) {
      console.error('Error fetching bets:', err);
      setError(err.message || 'Failed to load bets');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals from bets
  const totalInvested = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalValue = bets.reduce((sum, bet) => sum + bet.currentValue, 0);
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
            <span className="stat-number">{bets.length}</span>
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
          Loading your bets...
        </div>
      ) : (
        <div className="portfolio-content">
          <div className="portfolio-tabs">
            <button
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Bets ({bets.length})
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>

          <div className="positions-list">
            {bets.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                <p>No bets found. Start trading on prediction markets!</p>
                <Link to="/markets">
                  <Button variant="primary">Browse Markets</Button>
                </Link>
              </div>
            ) : (
              bets.map(bet => {
                const gainLoss = bet.currentValue - bet.amount;
                const gainLossPercentage = ((gainLoss / bet.amount) * 100).toFixed(2);

                return (
                  <div key={bet.id} className="position-card">
                    <div className="position-header">
                      <Link to={`/markets/${bet.marketId}`} className="position-title">
                        Market: {bet.marketId}
                      </Link>
                      <PrivacyBadge isPrivate={bet.isPrivate} />
                    </div>

                    <div className="position-details">
                      <div className="position-outcome">
                        <span className={`outcome-badge outcome-${bet.outcome.toLowerCase()}`}>
                          {bet.outcome}
                        </span>
                        <span className="shares-count">{bet.shares.toFixed(2)} shares @ {bet.odds}%</span>
                      </div>

                      <div className="position-stats">
                        <div className="position-stat">
                          <span className="stat-label">Invested</span>
                          <span className="stat-value">{bet.amount} DUST</span>
                        </div>
                        <div className="position-stat">
                          <span className="stat-label">Current Value</span>
                          <span className="stat-value">{bet.currentValue} DUST</span>
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
                      <Link to={`/markets/${bet.marketId}`}>
                        <Button variant="ghost" size="small">View Market</Button>
                      </Link>
                      <Button variant="danger" size="small">Close Position</Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
