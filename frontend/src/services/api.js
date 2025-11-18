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
// BETS API (Placeholder for future)
// ============================================

export async function placeBet(betData) {
    return apiFetch('/api/bets', {
        method: 'POST',
        body: JSON.stringify(betData),
    });
}

export default {
    getMarkets,
    getMarketById,
    getMarketStats,
    createMarket,
    getPositions,
    placeBet,
};
