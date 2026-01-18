const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, studentId, program } = req.body;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).send({ message: 'Email already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password, // In a real app, hash this!
        studentId,
        program
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id }, 'secret-key', { expiresIn: '24h' });
    res.send({ token, user: newUser });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '24h' });
    res.send({ token, user });
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
