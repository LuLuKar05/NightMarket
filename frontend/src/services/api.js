// API service for NightMarket backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// ============================================
// MARKETS API
// ============================================

/**
 * Get all markets with optional filtering
 */
export async function getMarkets(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.category && params.category !== 'All') {
        queryParams.append('category', params.category);
    }
    if (params.status) {
        queryParams.append('status', params.status);
    }
    if (params.search) {
        queryParams.append('search', params.search);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/markets${queryString ? `?${queryString}` : ''}`;

    return apiFetch(endpoint);
}

/**
 * Get a single market by ID
 */
export async function getMarketById(id) {
    return apiFetch(`/api/markets/${id}`);
}

/**
 * Get market statistics
 */
export async function getMarketStats() {
    return apiFetch('/api/markets/stats');
}

/**
 * Create a new market
 */
export async function createMarket(marketData) {
    return apiFetch('/api/markets', {
        method: 'POST',
        body: JSON.stringify(marketData),
    });
}

// ============================================
// POSITIONS API (Placeholder for future)
// ============================================

export async function getPositions(walletAddress) {
    return apiFetch(`/api/positions?wallet=${walletAddress}`);
}

// ============================================
// BETS API
// ============================================

/**
 * Place a bet on a market
 * @param {Object} betData - Bet data
 * @param {string} betData.marketId - Market ID
 * @param {string} betData.walletAddress - User wallet address
 * @param {string} betData.outcome - "YES" or "NO"
 * @param {number} betData.amount - Bet amount
 * @param {boolean} betData.isPrivate - Whether bet is private
 * @returns {Promise<Object>} { success, message, data }
 */
export async function placeBet(betData) {
    return apiFetch('/api/bets', {
        method: 'POST',
        body: JSON.stringify(betData),
    });
}

/**
 * Get all bets with optional filtering
 * @param {Object} params - Query parameters
 * @param {string} params.market - Filter by market ID
 * @param {string} params.wallet - Filter by wallet address
 * @returns {Promise<Object>} { success, count, data }
 */
export async function getBets(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.market) {
        queryParams.append('market', params.market);
    }
    if (params.wallet) {
        queryParams.append('wallet', params.wallet);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/bets${queryString ? `?${queryString}` : ''}`;

    return apiFetch(endpoint);
}

/**
 * Get a single bet by ID
 * @param {string} betId - Bet ID
 * @returns {Promise<Object>} { success, data }
 */
export async function getBetById(betId) {
    return apiFetch(`/api/bets/${betId}`);
}

/**
 * Close a position (delete bet)
 * @param {string} betId - Bet ID to close
 * @returns {Promise<Object>} { success, message, data }
 */
export async function closeBet(betId) {
    return apiFetch(`/api/bets/${betId}`, {
        method: 'DELETE',
    });
}

/**
 * Get betting statistics summary
 * @returns {Promise<Object>} { success, data }
 */
export async function getBetStats() {
    return apiFetch('/api/bets/stats/summary');
}

// ============================================
// PORTFOLIO API
// ============================================

/**
 * Get portfolio overview with active positions and stats
 * @param {string} walletAddress - User wallet address
 * @returns {Promise<Object>} { success, data: { walletAddress, stats, positions }, message }
 */
export async function getPortfolio(walletAddress) {
    return apiFetch(`/api/portfolio/${walletAddress}`);
}

/**
 * Get portfolio history with closed positions
 * @param {string} walletAddress - User wallet address
 * @param {Object} params - Query parameters
 * @param {string} params.outcome - Filter by outcome ("YES" or "NO")
 * @returns {Promise<Object>} { success, data: { walletAddress, stats, history }, message }
 */
export async function getPortfolioHistory(walletAddress, params = {}) {
    const queryParams = new URLSearchParams();

    if (params.outcome) {
        queryParams.append('outcome', params.outcome);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/portfolio/${walletAddress}/history${queryString ? `?${queryString}` : ''}`;

    return apiFetch(endpoint);
}

export default {
    // Markets
    getMarkets,
    getMarketById,
    getMarketStats,
    createMarket,
    // Positions
    getPositions,
    // Bets
    placeBet,
    getBets,
    getBetById,
    closeBet,
    getBetStats,
    // Portfolio
    getPortfolio,
    getPortfolioHistory,
};
