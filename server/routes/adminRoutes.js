const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const Interaction = require('../models/Interaction');
const KnowledgeBase = require('../models/KnowledgeBase');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error checking admin status' });
    }
};

// --- Knowledge Base Endpoints ---

// Get all KB entries
router.get('/kb', verifyToken, isAdmin, async (req, res) => {
    try {
        const kb = await KnowledgeBase.find();
        res.json(kb);
    } catch (e) {
        res.status(500).json({ message: 'Error reading KB' });
    }
});

// Add KB entry
router.post('/kb', verifyToken, isAdmin, async (req, res) => {
    try {
        const newEntry = new KnowledgeBase(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (e) {
        res.status(500).json({ message: 'Error updating KB' });
    }
});

// Update KB entry
router.put('/kb/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: 'Error updating KB' });
    }
});

// Delete KB entry
router.delete('/kb/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await KnowledgeBase.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: 'Error updating KB' });
    }
});

// --- Feedback & Analytics Endpoints ---

// Get unresolved interactions
router.get('/feedback', verifyToken, isAdmin, async (req, res) => {
    try {
        const unresolved = await Interaction.find({ resolved: false });
        res.json(unresolved);
    } catch (e) {
        res.status(500).json({ message: 'Error reading interactions' });
    }
});

// Resolve an interaction manually
router.post('/feedback/resolve/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Interaction.findByIdAndUpdate(req.params.id, { resolved: true });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: 'Error resolving interaction' });
    }
});

// Get system stats
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const interactionCount = await Interaction.countDocuments();
        const userCount = await User.countDocuments();
        const unresolvedCount = await Interaction.countDocuments({ resolved: false });

        res.json({
            totalUsers: userCount,
            totalInteractions: interactionCount,
            unresolvedQuestions: unresolvedCount,
            sentimentScore: 85 // Mocked for now
        });
    } catch (e) {
        res.status(500).json({ message: 'Error getting stats' });
    }
});

module.exports = router;
