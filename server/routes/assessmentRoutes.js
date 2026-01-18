const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Assessment = require('../models/Assessment');
const UserResult = require('../models/UserResult');
const Interaction = require('../models/Interaction'); // If needed

// GET / - List all assessments
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.find({}, 'title description');
        res.send(assessments);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching assessments' });
    }
});

// GET /:id - Get specific assessment with questions
router.get('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) return res.status(404).send({ message: 'Assessment not found' });
        res.send(assessment);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching assessment' });
    }
});

// POST /submit - Submit answers and get results
router.post('/submit', verifyToken, async (req, res) => {
    const { assessmentId, answers } = req.body;
    const userId = req.userId;

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) return res.status(404).send({ message: 'Invalid Assessment' });

        // Calculate Scores (RIASEC)
        const scores = {
            Realistic: 0,
            Investigative: 0,
            Artistic: 0,
            Social: 0,
            Enterprising: 0,
            Conventional: 0
        };

        assessment.questions.forEach(q => {
            if (answers[q.id]) {
                scores[q.category] = (scores[q.category] || 0) + 1;
            }
        });

        // Find Top Category
        const topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, "Realistic");

        // Note: For recommendations, we would normally query a Career model.
        // For now, we return empty or hardcoded since we haven't migrated Careers yet.
        const recommendations = [];

        const result = new UserResult({
            userId,
            assessmentId,
            scores,
            topCategory,
            recommendations
        });

        await result.save();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error submitting assessment' });
    }
});

module.exports = router;
