const mongoose = require('mongoose');

const UserResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    scores: { type: Map, of: Number },
    topCategory: { type: String },
    recommendations: { type: Array, default: [] },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserResult', UserResultSchema);
