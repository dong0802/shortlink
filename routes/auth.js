const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = new User({
            email,
            password,
            verificationToken,
            isVerified: !process.env.EMAIL_USER // Auto-verify if email not configured
        });

        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue even if email fails
        }

        const message = user.isVerified
            ? 'Registration successful! You can now log in.'
            : 'Registration successful! Please check your email to verify your account.';

        res.status(201).json({
            message,
            email: user.email
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(401).json({ error: 'Please verify your email first' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({
            message: 'Login successful',
            user: {
                email: user.email,
                id: user._id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({ user: null });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production');
        const user = await User.findById(decoded.userId).select('-password -verificationToken');

        if (!user) {
            return res.json({ user: null });
        }

        res.json({ user });
    } catch (error) {
        res.json({ user: null });
    }
});

// Verify email
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Failed</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 50px; background: #0a0f1e; color: white; }
            .error { color: #ef4444; }
            a { color: #6366f1; text-decoration: none; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ Invalid verification token</h1>
          <p>The verification link is invalid or has expired.</p>
          <a href="/">Go to Homepage</a>
        </body>
        </html>
      `);
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #0a0f1e; color: white; }
          .success { color: #10b981; }
          .btn { 
            display: inline-block; 
            margin-top: 20px; 
            padding: 12px 30px; 
            background: #4F46E5; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
          }
        </style>
      </head>
      <body>
        <h1 class="success">✅ Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in.</p>
        <a href="/" class="btn">Go to Homepage</a>
      </body>
      </html>
    `);
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('Verification failed');
    }
});

module.exports = router;
