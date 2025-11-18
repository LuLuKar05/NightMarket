const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Import mock data
let markets = require('../data/markets');

/**
 * GET /api/markets
 * Get all markets with optional filtering
 * Query params:
 *   - category: Filter by category (e.g., "Crypto", "Technology")
 *   - status: Filter by status (e.g., "active", "resolved")
 *   - search: Search in market question text
 */
router.get('/', (req, res) => {
    try {
        let filteredMarkets = [...markets];

        // Filter by category
        if (req.query.category) {
            const category = req.query.category;
            filteredMarkets = filteredMarkets.filter(
                market => market.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by status
        if (req.query.status) {
            const status = req.query.status;
            filteredMarkets = filteredMarkets.filter(
                market => market.status.toLowerCase() === status.toLowerCase()
            );
        }

        // Search in question text
        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();
            filteredMarkets = filteredMarkets.filter(
                market => market.question.toLowerCase().includes(searchTerm) ||
                    market.description.toLowerCase().includes(searchTerm)
            );
        }

        res.json({
            success: true,
            count: filteredMarkets.length,
            data: filteredMarkets
        });
    } catch (error) {
        console.error('Error fetching markets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch markets',
            message: error.message
        });
    }
});

/**
 * GET /api/markets/stats
 * Get aggregate statistics for all markets
 */
router.get('/stats', (req, res) => {
    try {
        const stats = {
            totalMarkets: markets.length,
            activeMarkets: markets.filter(m => m.status === 'active').length,
            totalVolume: markets.reduce((sum, market) => sum + market.volume, 0),
            totalTraders: markets.reduce((sum, market) => sum + market.traders, 0),
            totalLiquidity: markets.reduce((sum, market) => sum + market.liquidity, 0),
            privateMarkets: markets.filter(m => m.isPrivate).length,
            publicMarkets: markets.filter(m => !m.isPrivate).length,
            categoriesBreakdown: getCategoriesBreakdown(),
            averageVolume: Math.round(markets.reduce((sum, m) => sum + m.volume, 0) / markets.length),
            averageLiquidity: Math.round(markets.reduce((sum, m) => sum + m.liquidity, 0) / markets.length)
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching market stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market statistics',
            message: error.message
        });
    }
});

/**
 * GET /api/markets/:id
 * Get a single market by ID
 */
router.get('/:id', (req, res) => {
    try {
        const marketId = req.params.id;
        const market = markets.find(m => m.id === marketId);

        if (!market) {
            return res.status(404).json({
                success: false,
                error: 'Market not found',
                message: `No market found with ID: ${marketId}`
            });
        }

        res.json({
            success: true,
            data: market
        });
    } catch (error) {
        console.error('Error fetching market:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market',
            message: error.message
        });
    }
});

/**
 * POST /api/markets
 * Create a new market
 */
router.post('/', (req, res) => {
    try {
        const {
            question,
            description,
            category,
            endDate,
            isPrivate,
            createdBy
        } = req.body;

        // Validation
        if (!question || !description || !category || !endDate || !createdBy) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'question, description, category, endDate, and createdBy are required'
            });
        }

        // Create new market object
        const newMarket = {
            id: `market-${uuidv4()}`,
            question,
            description,
            category,
            volume: 0,
            traders: 0,
            liquidity: 0,
            status: 'active',
            isPrivate: isPrivate || false,
            yesOdds: 50,
            noOdds: 50,
            endDate,
            createdBy,
            createdAt: new Date().toISOString()
        };

        // Add to markets array
        markets.push(newMarket);

        res.status(201).json({
            success: true,
            message: 'Market created successfully',
            data: newMarket
        });
    } catch (error) {
        console.error('Error creating market:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create market',
            message: error.message
        });
    }
});

/**
 * Helper function to get categories breakdown
 */
function getCategoriesBreakdown() {
    const breakdown = {};
    markets.forEach(market => {
        if (!breakdown[market.category]) {
            breakdown[market.category] = {
                count: 0,
                totalVolume: 0,
                totalLiquidity: 0
            };
        }
        breakdown[market.category].count++;
        breakdown[market.category].totalVolume += market.volume;
        breakdown[market.category].totalLiquidity += market.liquidity;
    });
    return breakdown;
}

module.exports = router;
