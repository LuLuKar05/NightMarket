const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Import mock data
let markets = require('../data/markets');
const {
    addBet,
    getAllBets,
    getBetById,
    getBetsByMarketId,
    getBetsByWalletAddress,
    updateBet,
    deleteBet
} = require('../data/bets');

/**
 * POST /api/bets
 * Place a new bet on a market
 * Body: { marketId, walletAddress, outcome, amount, isPrivate }
 */
router.post('/', (req, res) => {
    try {
        const {
            marketId,
            walletAddress,
            outcome,
            amount,
            isPrivate
        } = req.body;

        // Validation
        if (!marketId || !walletAddress || !outcome || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'marketId, walletAddress, outcome, and amount are required'
            });
        }

        // Validate outcome
        if (outcome !== 'YES' && outcome !== 'NO') {
            return res.status(400).json({
                success: false,
                error: 'Invalid outcome',
                message: 'outcome must be either "YES" or "NO"'
            });
        }

        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount',
                message: 'amount must be a positive number'
            });
        }

        // Find the market
        const market = markets.find(m => m.id === marketId);
        if (!market) {
            return res.status(404).json({
                success: false,
                error: 'Market not found',
                message: `No market found with ID: ${marketId}`
            });
        }

        // Calculate shares based on current odds
        // shares = amount / (odds/100)
        const odds = outcome === 'YES' ? market.yesOdds : market.noOdds;
        const shares = Math.round((amount / (odds / 100)) * 100) / 100;

        // Create new bet
        const newBet = {
            id: `bet-${uuidv4()}`,
            marketId,
            walletAddress,
            outcome,
            amount,
            shares,
            odds,
            isPrivate: isPrivate || false,
            status: 'active',
            createdAt: new Date().toISOString(),
            currentValue: amount // Initially equal to invested amount
        };

        // Add bet to storage
        addBet(newBet);

        // Update market statistics
        const marketIndex = markets.findIndex(m => m.id === marketId);
        if (marketIndex !== -1) {
            markets[marketIndex].volume += amount;

            // Check if this is a new trader
            const existingBets = getBetsByMarketId(marketId);
            const uniqueTraders = new Set(existingBets.map(b => b.walletAddress));
            markets[marketIndex].traders = uniqueTraders.size;

            // Update odds based on new bet (simple algorithm)
            // This is a simplified version - in production, you'd use a more sophisticated AMM
            const totalYesBets = existingBets
                .filter(b => b.outcome === 'YES')
                .reduce((sum, b) => sum + b.amount, 0);
            const totalNoBets = existingBets
                .filter(b => b.outcome === 'NO')
                .reduce((sum, b) => sum + b.amount, 0);

            const totalBets = totalYesBets + totalNoBets;
            if (totalBets > 0) {
                markets[marketIndex].yesOdds = Math.round((totalYesBets / totalBets) * 100);
                markets[marketIndex].noOdds = 100 - markets[marketIndex].yesOdds;
            }
        }

        res.status(201).json({
            success: true,
            message: 'Bet placed successfully',
            data: newBet
        });
    } catch (error) {
        console.error('Error placing bet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to place bet',
            message: error.message
        });
    }
});

/**
 * GET /api/bets
 * Get all bets with optional filtering
 * Query params:
 *   - market: Filter by market ID
 *   - wallet: Filter by wallet address
 */
router.get('/', (req, res) => {
    try {
        let bets = getAllBets();

        // Filter by market ID
        if (req.query.market) {
            bets = getBetsByMarketId(req.query.market);
        }

        // Filter by wallet address
        if (req.query.wallet) {
            bets = getBetsByWalletAddress(req.query.wallet);
        }

        res.json({
            success: true,
            count: bets.length,
            data: bets
        });
    } catch (error) {
        console.error('Error fetching bets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bets',
            message: error.message
        });
    }
});

/**
 * GET /api/bets/:id
 * Get a single bet by ID with related market info
 */
router.get('/:id', (req, res) => {
    try {
        const betId = req.params.id;
        const bet = getBetById(betId);

        if (!bet) {
            return res.status(404).json({
                success: false,
                error: 'Bet not found',
                message: `No bet found with ID: ${betId}`
            });
        }

        // Include related market info
        const market = markets.find(m => m.id === bet.marketId);

        const betWithMarket = {
            ...bet,
            market: market ? {
                id: market.id,
                question: market.question,
                category: market.category,
                status: market.status,
                yesOdds: market.yesOdds,
                noOdds: market.noOdds
            } : null
        };

        res.json({
            success: true,
            data: betWithMarket
        });
    } catch (error) {
        console.error('Error fetching bet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bet',
            message: error.message
        });
    }
});

/**
 * DELETE /api/bets/:id
 * Close a position (remove bet)
 * Returns closing summary with profit/loss
 */
router.delete('/:id', (req, res) => {
    try {
        const betId = req.params.id;
        const bet = getBetById(betId);

        if (!bet) {
            return res.status(404).json({
                success: false,
                error: 'Bet not found',
                message: `No bet found with ID: ${betId}`
            });
        }

        // Get current market to calculate final value
        const market = markets.find(m => m.id === bet.marketId);

        // Calculate final value based on current odds
        let finalValue = bet.amount;
        if (market) {
            const currentOdds = bet.outcome === 'YES' ? market.yesOdds : market.noOdds;
            finalValue = Math.round(bet.shares * (currentOdds / 100) * 100) / 100;
        }

        const profit = finalValue - bet.amount;
        const returnPercentage = ((profit / bet.amount) * 100).toFixed(2);

        // Create closing summary
        const closingSummary = {
            betId: bet.id,
            marketId: bet.marketId,
            marketQuestion: market?.question || 'Unknown',
            outcome: bet.outcome,
            invested: bet.amount,
            finalValue: finalValue,
            profit: profit,
            returnPercentage: returnPercentage,
            shares: bet.shares,
            closedAt: new Date().toISOString()
        };

        // Mark bet as closed instead of deleting
        updateBet(betId, {
            status: 'closed',
            closedValue: finalValue,
            closingOdds: bet.outcome === 'YES' ? market?.yesOdds : market?.noOdds,
            closedAt: new Date().toISOString()
        });

        // Update market traders count
        if (market) {
            const marketIndex = markets.findIndex(m => m.id === bet.marketId);
            if (marketIndex !== -1) {
                const remainingBets = getBetsByMarketId(bet.marketId);
                const uniqueTraders = new Set(remainingBets.map(b => b.walletAddress));
                markets[marketIndex].traders = uniqueTraders.size;
            }
        }

        res.json({
            success: true,
            message: 'Position closed successfully',
            data: closingSummary
        });
    } catch (error) {
        console.error('Error closing position:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to close position',
            message: error.message
        });
    }
});

/**
 * GET /api/bets/stats/summary
 * Get betting statistics summary
 */
router.get('/stats/summary', (req, res) => {
    try {
        const allBets = getAllBets();

        const totalBets = allBets.length;
        const totalVolume = allBets.reduce((sum, bet) => sum + bet.amount, 0);
        const uniqueTraders = new Set(allBets.map(bet => bet.walletAddress)).size;

        const yesBets = allBets.filter(b => b.outcome === 'YES');
        const noBets = allBets.filter(b => b.outcome === 'NO');

        const stats = {
            totalBets,
            totalVolume,
            uniqueTraders,
            yesBets: yesBets.length,
            noBets: noBets.length,
            yesVolume: yesBets.reduce((sum, b) => sum + b.amount, 0),
            noVolume: noBets.reduce((sum, b) => sum + b.amount, 0),
            activeBets: allBets.filter(b => b.status === 'active').length,
            privateBets: allBets.filter(b => b.isPrivate).length
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching bet stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bet statistics',
            message: error.message
        });
    }
});

module.exports = router;
