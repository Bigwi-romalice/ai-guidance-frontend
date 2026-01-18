const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const programsFilePath = path.join(__dirname, '../data/programs.json');

const getPrograms = () => {
    if (!fs.existsSync(programsFilePath)) return [];
    try {
        const data = fs.readFileSync(programsFilePath);
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

router.get('/programs', (req, res) => {
    res.send(getPrograms());
});

module.exports = router;
