const express = require('express');
const router = express.Router();
const Career = require('../models/Career');
const verifyToken = require('../middleware/authMiddleware');

// GET / - List all careers
router.get('/', async (req, res) => {
    try {
        const careers = await Career.find();
        res.json(careers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching careers' });
    }
});

// GET /:id - Get career details
router.get('/:id', async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (!career) return res.status(404).json({ message: 'Career not found' });
        res.json(career);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching career details' });
    }
});
module.exports = router;
