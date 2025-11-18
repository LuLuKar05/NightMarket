const express = require('express');
const router = express.Router();

// Import data sources
const markets = require('../data/markets');
const positions = require('../data/positions');
const { getBetsByWalletAddress } = require('../data/bets');

/**
 * GET /api/portfolio/:walletAddress
 * Get portfolio overview with active positions and stats
 * 
 * Response includes:
 * - Active positions enriched with market data
 * - Portfolio statistics (invested, current value, returns, position count)
 */
router.get('/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'Missing wallet address',
                message: 'Wallet address is required'
            });
        }

        // Get all bets for this wallet (active positions)
        const walletBets = getBetsByWalletAddress(walletAddress);

        // Filter only active bets (not closed)
        const activeBets = walletBets.filter(bet => bet.status === 'active');

        // Enrich positions with market information
        const enrichedPositions = activeBets.map(bet => {
            const market = markets.find(m => m.id === bet.marketId);

            if (!market) {
                return {
                    ...bet,
                    market: null,
                    error: 'Market not found'
                };
            }

            // Calculate current value based on current market odds
            const currentOdds = bet.outcome === 'YES' ? market.yesOdds : market.noOdds;
            const currentValue = bet.shares * (currentOdds / 100);

            // Calculate return
            const absoluteReturn = currentValue - bet.amount;
            const returnPercentage = ((currentValue - bet.amount) / bet.amount) * 100;

            return {
                id: bet.id,
                marketId: bet.marketId,
                marketQuestion: market.question,
                marketCategory: market.category,
                marketStatus: market.status,
                marketEndDate: market.endDate,
                outcome: bet.outcome,
                shares: bet.shares,
                invested: bet.amount,
                currentValue: parseFloat(currentValue.toFixed(2)),
                absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
                returnPercentage: parseFloat(returnPercentage.toFixed(2)),
                averageCost: parseFloat((bet.amount / bet.shares).toFixed(2)),
                currentOdds: currentOdds,
                isPrivate: bet.isPrivate,
                createdAt: bet.createdAt
            };
        });

        // Calculate portfolio statistics
        const stats = {
            totalInvested: 0,
            totalCurrentValue: 0,
            totalAbsoluteReturn: 0,
            totalReturnPercentage: 0,
            activePositionsCount: enrichedPositions.length,
            winningPositions: 0,
            losingPositions: 0,
            breakEvenPositions: 0
        };

        enrichedPositions.forEach(position => {
            stats.totalInvested += position.invested;
            stats.totalCurrentValue += position.currentValue;
            stats.totalAbsoluteReturn += position.absoluteReturn;

            if (position.absoluteReturn > 0) stats.winningPositions++;
            else if (position.absoluteReturn < 0) stats.losingPositions++;
            else stats.breakEvenPositions++;
        });

        // Calculate overall return percentage
        if (stats.totalInvested > 0) {
            stats.totalReturnPercentage = parseFloat(
                ((stats.totalCurrentValue - stats.totalInvested) / stats.totalInvested * 100).toFixed(2)
            );
        }

        // Round stats to 2 decimal places
        stats.totalInvested = parseFloat(stats.totalInvested.toFixed(2));
        stats.totalCurrentValue = parseFloat(stats.totalCurrentValue.toFixed(2));
        stats.totalAbsoluteReturn = parseFloat(stats.totalAbsoluteReturn.toFixed(2));

        res.json({
            success: true,
            data: {
                walletAddress,
                stats,
                positions: enrichedPositions
            },
            message: `Retrieved ${enrichedPositions.length} active positions`
        });

    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch portfolio data'
        });
    }
});

/**
 * GET /api/portfolio/:walletAddress/history
 * Get historical/closed positions for a wallet
 * 
 * Returns:
 * - Closed positions with resolution outcomes
 * - Final returns and P&L
 * - Market resolution details
 */
router.get('/:walletAddress/history', (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { status, outcome } = req.query;

        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'Missing wallet address',
                message: 'Wallet address is required'
            });
        }

        // Get all bets for this wallet
        const walletBets = getBetsByWalletAddress(walletAddress);

        // Filter closed bets
        let closedBets = walletBets.filter(bet => bet.status === 'closed');

        // Apply additional filters if provided
        if (outcome) {
            closedBets = closedBets.filter(bet =>
                bet.outcome.toUpperCase() === outcome.toUpperCase()
            );
        }

        // Enrich closed positions with market information
        const enrichedHistory = closedBets.map(bet => {
            const market = markets.find(m => m.id === bet.marketId);

            if (!market) {
                return {
                    ...bet,
                    market: null,
                    error: 'Market not found'
                };
            }

            // For closed positions, calculate final value
            const finalValue = bet.closedValue || bet.amount; // Use closedValue if available
            const absoluteReturn = finalValue - bet.amount;
            const returnPercentage = ((finalValue - bet.amount) / bet.amount) * 100;

            return {
                id: bet.id,
                marketId: bet.marketId,
                marketQuestion: market.question,
                marketCategory: market.category,
                marketStatus: market.status,
                marketResolution: market.resolution || null, // Resolution outcome if market is resolved
                outcome: bet.outcome,
                shares: bet.shares,
                invested: bet.amount,
                finalValue: parseFloat(finalValue.toFixed(2)),
                absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
                returnPercentage: parseFloat(returnPercentage.toFixed(2)),
                averageCost: parseFloat((bet.amount / bet.shares).toFixed(2)),
                closingOdds: bet.closingOdds || null,
                isPrivate: bet.isPrivate,
                createdAt: bet.createdAt,
                closedAt: bet.closedAt || null
            };
        });

        // Calculate history statistics
        const historyStats = {
            totalPositions: enrichedHistory.length,
            totalInvested: 0,
            totalFinalValue: 0,
            totalReturn: 0,
            totalReturnPercentage: 0,
            wonPositions: 0,
            lostPositions: 0,
            breakEvenPositions: 0
        };

        enrichedHistory.forEach(position => {
            historyStats.totalInvested += position.invested;
            historyStats.totalFinalValue += position.finalValue;
            historyStats.totalReturn += position.absoluteReturn;

            if (position.absoluteReturn > 0) historyStats.wonPositions++;
            else if (position.absoluteReturn < 0) historyStats.lostPositions++;
            else historyStats.breakEvenPositions++;
        });

        // Calculate overall return percentage
        if (historyStats.totalInvested > 0) {
            historyStats.totalReturnPercentage = parseFloat(
                ((historyStats.totalFinalValue - historyStats.totalInvested) / historyStats.totalInvested * 100).toFixed(2)
            );
        }

        // Round stats
        historyStats.totalInvested = parseFloat(historyStats.totalInvested.toFixed(2));
        historyStats.totalFinalValue = parseFloat(historyStats.totalFinalValue.toFixed(2));
        historyStats.totalReturn = parseFloat(historyStats.totalReturn.toFixed(2));

        res.json({
            success: true,
            data: {
                walletAddress,
                stats: historyStats,
                history: enrichedHistory
            },
            message: `Retrieved ${enrichedHistory.length} historical positions`
        });

    } catch (error) {
        console.error('Error fetching portfolio history:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch portfolio history'
        });
    }
});

module.exports = router;
