import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MarketDetail.css';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import PrivacyBadge from '../components/market/PrivacyBadge';
import OddsBar from '../components/market/OddsBar';
import Countdown from '../components/market/Countdown';
import { getMarketById } from '../services/api';

export default function MarketDetail() {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(null);

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
    setSelectedOutcome(outcome);
    setShowBetModal(true);
  };

  const confirmBet = () => {
    console.log(`Placing ${selectedOutcome} bet of ${betAmount} DUST`);
    setShowBetModal(false);
    setBetAmount('');
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
        onClose={() => setShowBetModal(false)}
        title={`Place ${selectedOutcome} Bet`}
      >
        <div className="bet-modal-content">
          <p>You are betting <strong>{selectedOutcome}</strong> on this market.</p>
          <Input
            label="Bet Amount"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="Enter amount"
            suffix="DUST"
          />
          <div className="potential-return">
            <span>Potential Return:</span>
            <span className="return-value">
              {betAmount ? (parseFloat(betAmount) * (selectedOutcome === 'YES' ? market.yesOdds : market.noOdds) / 100).toFixed(2) : '0'} DUST
            </span>
          </div>
          <Button 
            variant="primary" 
            onClick={confirmBet}
            disabled={!betAmount || parseFloat(betAmount) <= 0}
          >
            Confirm Bet
          </Button>
        </div>
      </Modal>
    </div>
  );
}
