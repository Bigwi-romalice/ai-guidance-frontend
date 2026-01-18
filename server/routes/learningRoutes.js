const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const KnowledgeBase = require('../models/KnowledgeBase');

router.get('/recommendations', verifyToken, async (req, res) => {
    try {
        const kb = await KnowledgeBase.find({ category: 'Learning' });
        res.json(kb);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching learning recommendations' });
    }
});

module.exports = router;
