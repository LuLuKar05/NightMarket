import { useState, useEffect } from 'react';
import './MarketList.css';
import MarketCard from '../components/market/MarketCard';
import Button from '../components/common/Button';
import { getMarkets, getMarketStats } from '../services/api';

export default function MarketList() {
  const [markets, setMarkets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('active');

  const categories = ['All', 'Crypto', 'Technology', 'Science', 'Climate', 'Politics', 'Finance', 'Sports', 'Entertainment'];
  const statuses = ['active', 'resolved', 'closed'];

  // Fetch markets from API
  useEffect(() => {
    fetchMarkets();
  }, [selectedCategory, selectedStatus, searchTerm]);

  // Fetch stats once on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        category: selectedCategory,
        status: selectedStatus,
        search: searchTerm
      };

      const response = await getMarkets(params);
      
      if (response.success) {
        setMarkets(response.data);
      }
    } catch (err) {
      console.error('Error fetching markets:', err);
      setError(err.message || 'Failed to load markets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getMarketStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Calculate stats from currently filtered markets
  const filteredStats = {
    activeMarketsCount: markets.filter(m => m.status === 'active').length,
    totalMarkets: markets.length,
    totalVolume: markets.reduce((sum, m) => sum + (m.volume || 0), 0),
    totalTraders: markets.reduce((sum, m) => sum + (m.traders || 0), 0),
  };

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
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#ff4444', 
          color: 'white', 
          borderRadius: '8px', 
          marginBottom: '1rem' 
        }}>
          Error: {error}
        </div>
      )}

      <div className="market-stats-row">
        <div className="stat-card">
          <span className="stat-number">{selectedStatus === 'active' ? filteredStats.activeMarketsCount : filteredStats.totalMarkets}</span>
          <span className="stat-label">{selectedStatus === 'active' ? 'ACTIVE MARKETS' : 'TOTAL MARKETS'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{filteredStats.totalVolume.toLocaleString()} DUST</span>
          <span className="stat-label">TOTAL VOLUME</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{filteredStats.totalTraders.toLocaleString()}</span>
          <span className="stat-label">TOTAL TRADERS</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          Loading markets...
        </div>
      ) : (
        <div className="markets-grid">
          {markets.length > 0 ? (
            markets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))
          ) : (
            <div className="no-markets">
              <p>No markets found matching your criteria</p>
              <Button variant="secondary" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedStatus('active');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
