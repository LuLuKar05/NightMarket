// In-memory storage for bets (resets on server restart)
// In production, this would be stored in a database

let bets = [];

// Helper function to add a new bet
const addBet = (bet) => {
    bets.push(bet);
    return bet;
};

// Helper function to get all bets
const getAllBets = () => {
    return bets;
};

// Helper function to get bets by market ID
const getBetsByMarketId = (marketId) => {
    return bets.filter(bet => bet.marketId === marketId);
};

// Helper function to get bets by wallet address
const getBetsByWalletAddress = (walletAddress) => {
    return bets.filter(bet => bet.walletAddress.toLowerCase() === walletAddress.toLowerCase());
};

// Helper function to get a specific bet by ID
const getBetById = (betId) => {
    return bets.find(bet => bet.id === betId);
};

// Helper function to update a bet
const updateBet = (betId, updates) => {
    const betIndex = bets.findIndex(bet => bet.id === betId);
    if (betIndex !== -1) {
        bets[betIndex] = { ...bets[betIndex], ...updates };
        return bets[betIndex];
    }
    return null;
};

// Helper function to delete a bet
const deleteBet = (betId) => {
    const betIndex = bets.findIndex(bet => bet.id === betId);
    if (betIndex !== -1) {
        const deletedBet = bets[betIndex];
        bets.splice(betIndex, 1);
        return deletedBet;
    }
    return null;
};

// Helper function to clear all bets (useful for testing)
const clearAllBets = () => {
    bets = [];
    return true;
};

module.exports = {
    bets,
    addBet,
    getAllBets,
    getBetsByMarketId,
    getBetsByWalletAddress,
    getBetById,
    updateBet,
    deleteBet,
    clearAllBets
};
