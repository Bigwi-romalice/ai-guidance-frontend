const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error fetching profile' });
    }
});

// Update Profile Route
router.put('/profile', verifyToken, async (req, res) => {
    const { firstName, lastName, studentId, program } = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.studentId = studentId || user.studentId;
        user.program = program || user.program;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.send(userResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error updating profile' });
    }
});

module.exports = router;
