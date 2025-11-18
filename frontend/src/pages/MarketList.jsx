import { useState } from 'react';
import './MarketList.css';
import MarketCard from '../components/market/MarketCard';
import Button from '../components/common/Button';

// Mock data
const MOCK_MARKETS = [
  {
    id: 1,
    question: 'Will Bitcoin reach $100,000 by end of 2025?',
    category: 'Crypto',
    volume: 124500,
    traders: 342,
    liquidity: 250000,
    status: 'Active',
    isPrivate: true
  },
  {
    id: 2,
    question: 'Will Ethereum implement sharding in Q1 2026?',
    category: 'Technology',
    volume: 89200,
    traders: 215,
    liquidity: 180000,
    status: 'Active',
    isPrivate: false
  },
  {
    id: 3,
    question: 'Will SpaceX launch Starship to orbit in 2025?',
    category: 'Technology',
    volume: 156000,
    traders: 428,
    liquidity: 320000,
    status: 'Active',
    isPrivate: true
  }
];

export default function MarketList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('Active');

  const categories = ['All', 'Crypto', 'Technology', 'Sports', 'Politics', 'Entertainment'];
  const statuses = ['Active', 'Resolved', 'Closing Soon'];

  const filteredMarkets = MOCK_MARKETS.filter(market => {
    const matchesSearch = market.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
    const matchesStatus = market.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalVolume = MOCK_MARKETS.reduce((sum, m) => sum + m.volume, 0);
  const totalTraders = MOCK_MARKETS.reduce((sum, m) => sum + m.traders, 0);

  return (
    <div className="market-list-page">
      <div className="market-list-header">
        <div>
          <h1>Prediction Markets</h1>
          <p className="page-description">Trade on future events with privacy-preserving predictions</p>
        </div>
        <Button variant="primary">+ Create Market</Button>
      </div>

      <div className="market-filters">
        <input
          type="text"
          placeholder="Search markets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-section">
          <span className="filter-label">CATEGORY</span>
          <div className="filter-chips">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <span className="filter-label">STATUS</span>
          <div className="filter-chips">
            {statuses.map(status => (
              <button
                key={status}
                className={`filter-chip ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="market-stats-row">
        <div className="stat-card">
          <span className="stat-number">{MOCK_MARKETS.length}</span>
          <span className="stat-label">ACTIVE MARKETS</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalVolume.toLocaleString()} DUST</span>
          <span className="stat-label">TOTAL VOLUME (DUST)</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalTraders}</span>
          <span className="stat-label">TOTAL TRADERS</span>
        </div>
      </div>

      <div className="markets-grid">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))
        ) : (
          <div className="no-markets">
            <p>No markets found matching your criteria</p>
            <Button variant="secondary" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('Active');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
