const express = require('express');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

router.get('/profile', verifyToken, (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });

    // Don't send password
    const { password, ...userProfile } = user;
    res.send(userProfile);
});

module.exports = router;
