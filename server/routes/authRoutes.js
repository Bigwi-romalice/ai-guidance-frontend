const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'secret-key';

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, studentId, program } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password, // In a real app, hash this!
            studentId,
            program
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn: '24h' });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).send({ token, user: userResponse });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error during registration' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) { // In a real app, compare hashed passwords
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '24h' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.send({ user: userResponse, token });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error during login' });
    }
});

const emailService = require('../services/emailService');

// In-memory store for reset codes (for demo purposes)
const resetCodes = {};

router.post('/request-reset', async (req, res) => {
    const { email } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes[email] = code;

    try {
        const previewUrl = await emailService.sendResetCode(email, code);
        res.send({
            message: 'Reset code sent to your email!',
            previewUrl: previewUrl // This is for demo/testing purposes
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        // Fallback for demo if mail server fails
        console.log(`[FALLBACK] Reset code for ${email}: ${code}`);
        res.send({ message: 'Mail service unavailable. Code logged to server console.' });
    }
});

router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (resetCodes[email] && resetCodes[email] === code) {
        res.send({ success: true });
    } else {
        res.status(400).send({ message: 'Invalid or expired code' });
    }
});

router.post('/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body;
    if (resetCodes[email] && resetCodes[email] === code) {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            saveUsers(users);
            delete resetCodes[email];
            res.send({ message: 'Password reset successful!' });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } else {
        res.status(400).send({ message: 'Invalid or expired code' });
    }
});

module.exports = router;
