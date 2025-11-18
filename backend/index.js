const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());             // Allow cross-origin requests (vital for frontend communication)
app.use(express.json());     // Parse incoming JSON payloads

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Hello from the Backend!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});