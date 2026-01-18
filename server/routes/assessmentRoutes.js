const express = require('express');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware'); // Optional, if we want to force login

const router = express.Router();
const assessmentsFilePath = path.join(__dirname, '../data/assessments.json');
const resultsFilePath = path.join(__dirname, '../data/user_results.json');
const careersFilePath = path.join(__dirname, '../data/careers.json');

const getAssessments = () => {
    if (!fs.existsSync(assessmentsFilePath)) return [];
    return JSON.parse(fs.readFileSync(assessmentsFilePath, 'utf8'));
};

const getResults = () => {
    if (!fs.existsSync(resultsFilePath)) return [];
    try {
        return JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
    } catch { return []; }
};

const getCareers = () => {
    if (!fs.existsSync(careersFilePath)) return [];
    try {
        return JSON.parse(fs.readFileSync(careersFilePath, 'utf8'));
    } catch { return []; }
}

const saveResults = (results) => {
    fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
};

// GET / - List all assessments
router.get('/', (req, res) => {
    const assessments = getAssessments();
    // Return only basic info, not questions yet
    const list = assessments.map(a => ({ id: a.id, title: a.title, description: a.description }));
    res.send(list);
});

// GET /:id - Get specific assessment with questions
router.get('/:id', (req, res) => {
    const assessments = getAssessments();
    const assessment = assessments.find(a => a.id === req.params.id);
    if (!assessment) return res.status(404).send({ message: 'Assessment not found' });
    res.send(assessment);
});

// POST /submit - Submit answers and get results
router.post('/submit', verifyToken, (req, res) => {
    const { assessmentId, answers } = req.body; // answers: { questionId: value (1-5) } or just selected boolean
    const userId = req.userId;

    const assessments = getAssessments();
    const assessment = assessments.find(a => a.id === assessmentId);
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

    // Calculate max possible score to normalize if needed, but simple count is fine for now
    // Assuming answers is array of question IDs that were "Selected" (True)
    // Or map of ID -> Boolean

    // Let's assume frontend sends: { "1": true, "2": false ... }

    assessment.questions.forEach(q => {
        if (answers[q.id]) {
            scores[q.category] = (scores[q.category] || 0) + 1;
        }
    });

    // Find Top Category
    const topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    // Get Career Recommendations
    const allCareers = getCareers();
    // Assuming careers.json might not have RIASEC tags yet, we'll do a loose match or return generic for now
    // Ideally careers.json should have "category": "Investigative" etc.
    // For now, let's just filter if possible, or return empty if data missing.
    // We will do a simple mock filter for demo:
    const recommendations = allCareers.filter(c =>
        (c.description && c.description.toLowerCase().includes(topCategory.toLowerCase())) ||
        (c.title && c.title.toLowerCase().includes(topCategory.toLowerCase()))
    ).slice(0, 3);

    const result = {
        id: Date.now().toString(),
        userId,
        assessmentId,
        date: new Date().toISOString(),
        scores,
        topCategory,
        recommendations
    };

    const results = getResults();
    results.push(result);
    saveResults(results);

    res.send(result);
});

module.exports = router;
