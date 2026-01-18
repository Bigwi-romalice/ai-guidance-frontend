const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    program: { type: String },
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    topic: { type: String, default: 'general' },
    sentiment: { type: String, default: 'Neutral' },
    resolved: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interaction', InteractionSchema);
