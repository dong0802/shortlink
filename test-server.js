// Simple server test
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

console.log('Starting server...');

// Connect to MongoDB
connectDB().then(() => {
    console.log('Database connected, starting Express...');

    app.get('/', (req, res) => {
        res.send('Server is running!');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
