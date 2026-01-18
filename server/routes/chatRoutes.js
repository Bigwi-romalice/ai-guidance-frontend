const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const Interaction = require('../models/Interaction');
const KnowledgeBase = require('../models/KnowledgeBase');

const analyzeSentiment = (text) => {
    const lower = text.toLowerCase();
    const positive = ['thanks', 'good', 'great', 'awesome', 'helpful', 'love', 'perfect'];
    const negative = ['bad', 'useless', 'wrong', 'confusing', 'hate', 'slow', 'stupid'];

    if (positive.some(w => lower.includes(w))) return 'Positive';
    if (negative.some(w => lower.includes(w))) return 'Negative';
    return 'Neutral';
};

// Protect route with verifyToken to get user context
router.post('/message', verifyToken, async (req, res) => {
    const { message } = req.body;
    const userId = req.userId; // From authMiddleware

    try {
        // Get User
        const user = await User.findById(userId);
        const program = user ? user.program : 'Unknown';

        // Load Knowledge Base from DB
        const knowledgeBase = await KnowledgeBase.find();

        // Match intent from Knowledge Base
        let responseText = "I'm not sure how to help with that yet. I've logged your question for our team to review!";
        let topic = "general";
        let resolved = false;

        const msg = message.toLowerCase();
        console.log(`[CHAT] Message from ${userId}: "${message}"`);

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

        // Log interaction to MongoDB
        const newInteraction = new Interaction({
            userId: userId,
            program: program,
            userMessage: message,
            botResponse: responseText,
            topic: topic,
            sentiment: sentiment,
            resolved: resolved
        });

        await newInteraction.save();

        // Send response
        res.send({ response: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).send({ response: "I'm having trouble connecting to my brain right now. Please try again later!" });
    }
});

module.exports = router;
