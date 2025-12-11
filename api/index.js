const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// MongoDB connection with caching for serverless
let cachedDb = null;

const connectDB = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log('Using cached database connection');
        return cachedDb;
    }

    try {
        const mongoURI = process.env.MONGODB_URI ||
            'mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

        console.log('Connecting to MongoDB...');

        // Close existing connection if any
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        const conn = await mongoose.connect(mongoURI, {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        cachedDb = conn;
        console.log('MongoDB Connected:', conn.connection.host);
        return cachedDb;
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        cachedDb = null;
        throw error;
    }
};

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Connect to DB before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('DB connection failed:', error);
        res.status(500).json({
            error: 'Database connection failed',
            message: error.message
        });
    }
});

// API Routes
try {
    app.use('/api/auth', require('../routes/auth'));
    app.use('/api/links', require('../routes/links'));
} catch (error) {
    console.error('Error loading routes:', error);
}

// Short code redirect route
const ShortLink = require('../models/ShortLink');
const { sendTelegramNotification } = require('../utils/telegram');

app.get('/:shortCode', async (req, res, next) => {
    // Skip if it's a file request or API route
    if (req.path.includes('.') || req.path.startsWith('/api')) {
        return next();
    }

    try {
        const { shortCode } = req.params;

        const link = await ShortLink.findOne({ shortCode });

        if (!link) {
            return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Not Found</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 50px; background: #0a0f1e; color: white; }
            .error { color: #ef4444; }
            a { color: #6366f1; text-decoration: none; }
          </style>
        </head>
        <body>
          <h1 class="error">404 - Link Not Found</h1>
          <p>The short link you're looking for doesn't exist.</p>
          <a href="/">Go to Homepage</a>
        </body>
        </html>
      `);
        }

        // Get client info
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown';
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Add click record
        link.clicks.push({
            ip,
            userAgent,
            timestamp: new Date()
        });
        link.clickCount += 1;

        await link.save();

        // Send Telegram notification (non-blocking)
        sendTelegramNotification(shortCode, link.originalUrl, ip, userAgent).catch(err => {
            console.error('Telegram notification failed:', err);
        });

        // Redirect to original URL
        res.redirect(link.originalUrl);
    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).send('Redirect failed');
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Export for Vercel
module.exports = app;
