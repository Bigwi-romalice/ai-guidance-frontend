const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const careersFilePath = path.join(__dirname, '../data/careers.json');

const getCareers = () => {
    if (!fs.existsSync(careersFilePath)) return [];
    try {
        const data = fs.readFileSync(careersFilePath);
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

router.get('/paths', (req, res) => {
    const careers = getCareers();
    const { field } = req.query;
    if (field) {
        // Simple filter logic
        const filtered = careers.filter(c =>
            c.title.toLowerCase().includes(field.toLowerCase()) ||
            c.description.toLowerCase().includes(field.toLowerCase())
        );
        return res.send(filtered);
    }
    res.send(careers);
});

router.get('/details/:id', (req, res) => {
    const careers = getCareers();
    const career = careers.find(c => c.id === req.params.id);
    if (career) res.send(career);
    else res.status(404).send({ message: 'Career not found' });
});

module.exports = router;
