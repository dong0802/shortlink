const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    ip: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const shortLinkSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    clicks: [clickSchema],
    clickCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ShortLink', shortLinkSchema);
