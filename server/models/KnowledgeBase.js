const mongoose = require('mongoose');

const KBEntrySchema = new mongoose.Schema({
    intent: { type: String, required: true },
    keywords: [{ type: String }],
    response: { type: String, required: true },
    category: { type: String, default: 'General' }
});

module.exports = mongoose.model('KnowledgeBase', KBEntrySchema);
