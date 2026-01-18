const express = require('express');
const router = express.Router();



const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');

const interactionsFilePath = path.join(__dirname, '../data/interactions.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const analyzeSentiment = (text) => {
    const lower = text.toLowerCase();
    const positive = ['thanks', 'good', 'great', 'awesome', 'helpful', 'love', 'perfect'];
    const negative = ['bad', 'useless', 'wrong', 'confusing', 'hate', 'slow', 'stupid'];

    if (positive.some(w => lower.includes(w))) return 'Positive';
    if (negative.some(w => lower.includes(w))) return 'Negative';
    return 'Neutral';
};

// Protect route with verifyToken to get user context
router.post('/message', verifyToken, (req, res) => {
    const { message } = req.body;
    const userId = req.userId; // From authMiddleware

    // Get User Program
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    const program = user ? user.program : 'Unknown';

    // Load Knowledge Base
    const kbPath = path.join(__dirname, '../data/knowledgeBase.json');
    let knowledgeBase = [];
    if (fs.existsSync(kbPath)) {
        knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
    }

    // Match intent from Knowledge Base
    let responseText = "I'm not sure how to help with that yet. I've logged your question for our team to review!";
    let topic = "general";
    let resolved = false;

    // Direct match check (exact hi)
    if (msg === 'hi' || msg === 'hello') {
        responseText = "Hello! I am your AI Academic & Career Assistant. How can I help you today?";
        topic = "general";
        resolved = true;
    } else {
        // Search KB
        for (const entry of knowledgeBase) {
            if (entry.keywords.some(k => msg.includes(k.toLowerCase()))) {
                responseText = entry.response;
                topic = entry.category.toLowerCase();
                resolved = true;
                break;
            }
        }
    }

    // Sentiment Analysis
    const sentiment = analyzeSentiment(message);

    // Log interaction
    const newInteraction = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: userId,
        program: program,
        userMessage: message,
        botResponse: responseText,
        topic: topic,
        sentiment: sentiment,
        resolved: resolved
    };

    fs.readFile(interactionsFilePath, 'utf8', (err, data) => {
        let interactions = [];
        if (!err && data) {
            try {
                interactions = JSON.parse(data);
            } catch (e) {
                console.error("Error parsing interactions:", e);
            }
        }
        interactions.push(newInteraction);
        fs.writeFile(interactionsFilePath, JSON.stringify(interactions, null, 2), (err) => {
            if (err) console.error("Error saving interaction:", err);
        });
    });

    // Send response immediately
    res.send({ response: responseText });
});

module.exports = router;
