import './MarketCard.css';
import { Link } from 'react-router-dom';
import PrivacyBadge from './PrivacyBadge';

export default function MarketCard({ market }) {
  return (
    <Link to={`/markets/${market.id}`} className="market-card-link">
      <div className="market-card">
        <div className="market-header">
          <span className="market-category">{market.category}</span>
          <PrivacyBadge isPrivate={market.isPrivate} />
        </div>
        
        <h3 className="market-title">{market.question}</h3>
        
        <div className="market-stats">
          <div className="market-stat">
            <span className="stat-label">Volume</span>
            <span className="stat-value">{market.volume} DUST</span>
          </div>
          <div className="market-stat">
            <span className="stat-label">Traders</span>
            <span className="stat-value">{market.traders}</span>
          </div>
        </div>
        
        <div className="market-card-footer">
          <span className="market-liquidity">Liquidity: {market.liquidity} DUST</span>
          <span className={`market-status status-${market.status.toLowerCase()}`}>
            {market.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
