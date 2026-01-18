const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');

const kbFilePath = path.join(__dirname, '../data/knowledgeBase.json');
const interactionsFilePath = path.join(__dirname, '../data/interactions.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = users.find(u => u.id === req.userId);
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

// --- Knowledge Base Endpoints ---

// Get all KB entries
router.get('/kb', verifyToken, isAdmin, (req, res) => {
    try {
        const data = fs.readFileSync(kbFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.status(500).json({ message: 'Error reading KB' });
    }
});

// Add KB entry
router.post('/kb', verifyToken, isAdmin, (req, res) => {
    try {
        const kb = JSON.parse(fs.readFileSync(kbFilePath, 'utf8'));
        const newEntry = {
            id: Date.now().toString(),
            ...req.body
        };
        kb.push(newEntry);
        fs.writeFileSync(kbFilePath, JSON.stringify(kb, null, 2));
        res.status(201).json(newEntry);
    } catch (e) {
        res.status(500).json({ message: 'Error updating KB' });
    }
});

// Update KB entry
router.put('/kb/:id', verifyToken, isAdmin, (req, res) => {
    try {
        let kb = JSON.parse(fs.readFileSync(kbFilePath, 'utf8'));
        kb = kb.map(entry => entry.id === req.params.id ? { ...entry, ...req.body } : entry);
        fs.writeFileSync(kbFilePath, JSON.stringify(kb, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: 'Error updating KB' });
    }
});

// Delete KB entry
router.delete('/kb/:id', verifyToken, isAdmin, (req, res) => {
    try {
        let kb = JSON.parse(fs.readFileSync(kbFilePath, 'utf8'));
        kb = kb.filter(entry => entry.id !== req.params.id);
        fs.writeFileSync(kbFilePath, JSON.stringify(kb, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: 'Error updating KB' });
    }
});

// --- Feedback & Analytics Endpoints ---

// Get unresolved interactions
router.get('/feedback', verifyToken, isAdmin, (req, res) => {
    try {
        const interactions = JSON.parse(fs.readFileSync(interactionsFilePath, 'utf8'));
        const unresolved = interactions.filter(i => !i.resolved);
        res.json(unresolved);
    } catch (e) {
        res.status(500).json({ message: 'Error reading interactions' });
    }
});

// Resolve an interaction manually
router.post('/feedback/resolve/:id', verifyToken, isAdmin, (req, res) => {
    try {
        let interactions = JSON.parse(fs.readFileSync(interactionsFilePath, 'utf8'));
        interactions = interactions.map(i => i.id === req.params.id ? { ...i, resolved: true } : i);
        fs.writeFileSync(interactionsFilePath, JSON.stringify(interactions, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: 'Error resolving interaction' });
    }
});

// Get system stats
router.get('/stats', verifyToken, isAdmin, (req, res) => {
    try {
        const interactions = JSON.parse(fs.readFileSync(interactionsFilePath, 'utf8'));
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

        res.json({
            totalUsers: users.length,
            totalInteractions: interactions.length,
            unresolvedQuestions: interactions.filter(i => !i.resolved).length,
            sentimentScore: 85 // Mocked for now
        });
    } catch (e) {
        res.status(500).json({ message: 'Error getting stats' });
    }
});

module.exports = router;
