import { useState, useEffect } from 'react';
import './CreateMarketModal.css';
import Button from '../common/Button';
import Input from '../common/Input';
import { createMarket, getMarketCategories } from '../../services/api';

export default function CreateMarketModal({ isOpen, onClose, walletAddress, onMarketCreated }) {
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    category: 'Crypto',
    endDate: '',
    initialLiquidity: 0
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await getMarketCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback categories
      setCategories(['Crypto', 'Technology', 'Science', 'Climate', 'Politics', 'Finance', 'Sports', 'Entertainment', 'Other']);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.question.length < 10) {
      setError('Question must be at least 10 characters long');
      return;
    }

    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters long');
      return;
    }

    const endDate = new Date(formData.endDate);
    if (endDate <= new Date()) {
      setError('End date must be in the future');
      return;
    }

    try {
      setLoading(true);

      const marketData = {
        ...formData,
        createdBy: walletAddress,
        initialLiquidity: parseFloat(formData.initialLiquidity) || 0,
        isPrivate: true // All markets are private by default
      };

      const response = await createMarket(marketData);

      if (response.success) {
        // Reset form
        setFormData({
          question: '',
          description: '',
          category: 'Crypto',
          endDate: '',
          initialLiquidity: 0
        });

        // Notify parent
        if (onMarketCreated) {
          onMarketCreated(response.data);
        }

        // Close modal
        onClose();
      }
    } catch (err) {
      console.error('Error creating market:', err);
      setError(err.message || 'Failed to create market');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-market-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Market</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="create-market-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="question">Market Question *</label>
            <Input
              id="question"
              name="question"
              type="text"
              placeholder="e.g., Will Bitcoin reach $100,000 by end of 2025?"
              value={formData.question}
              onChange={handleChange}
              required
              maxLength={200}
            />
            <span className="char-count">{formData.question.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Detailed resolution criteria and conditions..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="form-textarea"
            />
            <span className="char-count">{formData.description.length} characters</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={getMinDate()}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="initialLiquidity">Initial Liquidity (DUST)</label>
            <Input
              id="initialLiquidity"
              name="initialLiquidity"
              type="number"
              placeholder="0"
              value={formData.initialLiquidity}
              onChange={handleChange}
              min="0"
              step="100"
            />
            <span className="form-hint">Optional: Add initial liquidity to your market</span>
          </div>

          <div className="privacy-notice">
            <div className="privacy-icon">🔒</div>
            <div className="privacy-content">
              <strong>All markets are private and shielded</strong>
              <p>Every market uses zero-knowledge proofs to protect trader identities and maintain privacy on the Midnight Network.</p>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Market'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
