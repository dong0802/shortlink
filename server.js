require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));

// Short code redirect route
const ShortLink = require('./models/ShortLink');
const { sendTelegramNotification } = require('./utils/telegram');

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
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Add click record
        link.clicks.push({
            ip,
            userAgent,
            timestamp: new Date()
        });
        link.clickCount += 1;

        await link.save();

        // Send Telegram notification
        try {
            await sendTelegramNotification(shortCode, link.originalUrl, ip, userAgent);
        } catch (telegramError) {
            console.error('Telegram notification failed:', telegramError);
        }

        // Redirect to original URL
        res.redirect(link.originalUrl);
    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).send('Redirect failed');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
