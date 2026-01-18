const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    category: { type: String, required: true }
});

const AssessmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [QuestionSchema]
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
