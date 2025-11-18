import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MarketDetail.css';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import PrivacyBadge from '../components/market/PrivacyBadge';
import OddsBar from '../components/market/OddsBar';
import Countdown from '../components/market/Countdown';
import { getMarketById, placeBet } from '../services/api';

export default function MarketDetail({ isConnected, walletAddress, onConnect }) {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [showBetModal, setShowBetModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [betLoading, setBetLoading] = useState(false);
  const [betError, setBetError] = useState(null);
  const [betSuccess, setBetSuccess] = useState(null);

  // Fetch market data from API
  useEffect(() => {
    fetchMarket();
  }, [id]);

  const fetchMarket = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMarketById(id);
      
      if (response.success) {
        setMarket(response.data);
      }
    } catch (err) {
      console.error('Error fetching market:', err);
      setError(err.message || 'Failed to load market');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBet = (outcome) => {
    // Check if wallet is connected
    if (!isConnected || !walletAddress) {
      // Show connect wallet modal
      setShowConnectModal(true);
      return;
    }

    setSelectedOutcome(outcome);
    setBetAmount('');
    setBetError(null);
    setBetSuccess(null);
    setShowBetModal(true);
  };

    const confirmBet = async () => {
    // Double-check wallet connection
    if (!isConnected || !walletAddress) {
      setBetError('Please connect your wallet to place a bet');
      return;
    }

    // Validate bet amount
    const amount = parseFloat(betAmount);
    if (!amount || amount <= 0) {
      setBetError('Please enter a valid bet amount');
      return;
    }

    try {
      setBetLoading(true);
      setBetError(null);

      const betData = {
        marketId: market.id,
        walletAddress: walletAddress,
        outcome: selectedOutcome,
        amount: amount,
        isPrivate: market.isPrivate || false
      };

      const response = await placeBet(betData);

      if (response.success) {
        setBetSuccess({
          message: `Successfully placed ${selectedOutcome} bet!`,
          shares: response.data.shares,
          amount: response.data.amount
        });
        
        // Refresh market data to get updated odds
        fetchMarket();

        // Clear form and close modal after 2 seconds
        setTimeout(() => {
          setShowBetModal(false);
          setBetAmount('');
          setBetSuccess(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Error placing bet:', err);
      setBetError(err.message || 'Failed to place bet');
    } finally {
      setBetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="market-detail-page">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          Loading market...
        </div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="market-detail-page">
        <div style={{ padding: '2rem', background: '#ff4444', color: 'white', borderRadius: '8px' }}>
          Error: {error || 'Market not found'}
        </div>
        <Link to="/markets">
          <Button variant="secondary" style={{ marginTop: '1rem' }}>Back to Markets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="market-detail-page">
      <div className="breadcrumb">
        <Link to="/markets">Markets</Link>
        <span>/</span>
        <span>{market.category}</span>
      </div>

      <div className="market-detail-grid">
        <div className="market-main">
          <div className="market-detail-header">
            <div className="header-badges">
              <span className="market-category">{market.category}</span>
              <PrivacyBadge isPrivate={market.isPrivate} />
            </div>
            <h1>{market.question}</h1>
            <p className="market-description">{market.description}</p>
          </div>

          <div className="market-stats-grid">
            <div className="stat-box">
              <div className="stat-icon">V</div>
              <div className="stat-content">
                <span className="stat-label">Volume</span>
                <span className="stat-value">{market.volume.toLocaleString()} DUST</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">T</div>
              <div className="stat-content">
                <span className="stat-label">Traders</span>
                <span className="stat-value">{market.traders}</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">L</div>
              <div className="stat-content">
                <span className="stat-label">Liquidity</span>
                <span className="stat-value">{market.liquidity.toLocaleString()} DUST</span>
              </div>
            </div>
          </div>

          <div className="odds-section">
            <h3>Current Odds</h3>
            <OddsBar yesOdds={market.yesOdds} noOdds={market.noOdds} />
          </div>

          <div className="market-info">
            <h3>Market Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Created By</span>
                <span className="info-value">{market.createdBy}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Created On</span>
                <span className="info-value">{market.createdAt}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">{market.status}</span>
              </div>
            </div>
            {market.isPrivate && (
              <div className="privacy-notice">
                <span className="privacy-indicator">●</span>
                <p>This is a private market. Your positions and trades are protected by zero-knowledge proofs.</p>
              </div>
            )}
          </div>
        </div>

        <div className="market-sidebar">
          <div className="trading-card">
            <h2>Place Your Bet</h2>
            <Countdown endDate={market.endDate} />
            <div className="bet-buttons">
              <Button 
                variant="primary" 
                onClick={() => handlePlaceBet('YES')}
                size="large"
              >
                Bet YES ({market.yesOdds}%)
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handlePlaceBet('NO')}
                size="large"
              >
                Bet NO ({market.noOdds}%)
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showBetModal} 
        onClose={() => !betLoading && setShowBetModal(false)}
        title={`Place ${selectedOutcome} Bet`}
      >
        <div className="bet-modal-content">
          {betSuccess ? (
            <div style={{ 
              padding: '2rem', 
              background: '#4CAF50', 
              color: 'white', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3>✓ {betSuccess.message}</h3>
              <p>Amount: {betSuccess.amount} DUST</p>
              <p>Shares: {betSuccess.shares.toFixed(2)}</p>
            </div>
          ) : (
            <>
              <p>You are betting <strong>{selectedOutcome}</strong> on this market.</p>
              
              {betError && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#ff4444', 
                  color: 'white', 
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  {betError}
                </div>
              )}

              <Input
                label="Bet Amount (DUST)"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter amount"
                suffix="DUST"
                disabled={betLoading}
              />
              
              <div className="bet-summary">
                <div className="summary-label">Shares</div>
                <div className="summary-box">
                  <div className="summary-row">
                    <span>You will receive:</span>
                    <span className="summary-value">
                      {betAmount ? (parseFloat(betAmount) / (selectedOutcome === 'YES' ? market.yesOdds / 100 : market.noOdds / 100)).toFixed(2) : '0'} shares
                    </span>
                  </div>
                  <div className="summary-row secondary">
                    <span>Current odds:</span>
                    <span>{selectedOutcome === 'YES' ? market.yesOdds : market.noOdds}%</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                onClick={confirmBet}
                disabled={!betAmount || parseFloat(betAmount) <= 0 || betLoading}
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                {betLoading ? 'Placing Bet...' : 'Confirm Bet'}
              </Button>
            </>
          )}
        </div>
      </Modal>

      {/* Wallet Connect Prompt Modal */}
      <Modal 
        isOpen={showConnectModal} 
        onClose={() => setShowConnectModal(false)}
        title="Connect Wallet Required"
      >
        <div style={{ padding: '1rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
            You need to connect your wallet to place bets on prediction markets.
          </p>
          
          <div style={{ 
            background: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
              💡 Connecting your wallet allows you to:
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#666' }}>
              <li>Place bets on markets</li>
              <li>Track your portfolio</li>
              <li>View your betting history</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowConnectModal(false);
                onConnect();
              }}
              style={{ flex: 1 }}
            >
              Connect Wallet
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowConnectModal(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
