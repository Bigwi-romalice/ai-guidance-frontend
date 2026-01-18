const express = require('express');
const router = express.Router();

// Mock Data
const learningResources = [
    {
        id: 1,
        title: "Python for Data Science",
        type: "Online Course",
        provider: "Coursera",
        duration: "20 hours",
        progress: 0
    },
    {
        id: 2,
        title: "Web Development Bootcamp",
        type: "Video Series",
        provider: "YouTube",
        duration: "15 hours",
        progress: 45
    }
];

router.get('/resources', (req, res) => {
    res.send(learningResources);
});

module.exports = router;
