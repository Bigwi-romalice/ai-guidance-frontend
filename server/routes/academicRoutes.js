const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const verifyToken = require('../middleware/authMiddleware');

router.get('/programs', async (req, res) => {
    try {
        const programs = await Program.find();
        res.send(programs);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching programs' });
    }
});

module.exports = router;
