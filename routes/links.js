const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const ShortLink = require('../models/ShortLink');
const { auth, requireAuth } = require('../middleware/auth');
const { sendTelegramNotification } = require('../utils/telegram');

// Create short link (no auth required)
router.post('/shorten', auth, async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        // Generate short code
        const shortCode = shortid.generate();

        // Create short link
        const shortLink = new ShortLink({
            originalUrl: url,
            shortCode,
            userId: req.user ? req.user._id : null
        });

        await shortLink.save();

        const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`;

        res.json({
            success: true,
            shortUrl,
            shortCode,
            originalUrl: url
        });
    } catch (error) {
        console.error('Shorten error:', error);
        res.status(500).json({ error: 'Failed to create short link' });
    }
});

// Get user's link history (auth required)
router.get('/history', requireAuth, async (req, res) => {
    try {
        const links = await ShortLink.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('-clicks');

        res.json({ links });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get link statistics (auth required)
router.get('/stats/:shortCode', requireAuth, async (req, res) => {
    try {
        const { shortCode } = req.params;

        const link = await ShortLink.findOne({
            shortCode,
            userId: req.user._id
        });

        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.json({
            shortCode: link.shortCode,
            originalUrl: link.originalUrl,
            clickCount: link.clickCount,
            clicks: link.clicks,
            createdAt: link.createdAt
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;

