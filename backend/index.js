require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Port Configuration
// Backend runs on port 3000
// Frontend (Vite) runs on port 5173
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());             // Allow cross-origin requests (vital for frontend communication)
app.use(express.json());     // Parse incoming JSON payloads

// Basic Route
app.get('/', (req, res) => {
    res.json({
        message: "NightMarket Backend API",
        network: process.env.MIDNIGHT_NETWORK || 'testnet',
        status: 'running'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        network: process.env.MIDNIGHT_NETWORK
    });
});

// API routes
app.use('/api/markets', require('./routes/markets'));
app.use('/api/bets', require('./routes/bets'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 NightMarket Backend running on http://localhost:${PORT}`);
    console.log(`📡 Network: ${process.env.MIDNIGHT_NETWORK || 'testnet'}`);
    console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});