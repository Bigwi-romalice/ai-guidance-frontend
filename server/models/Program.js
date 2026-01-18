const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    courses: [{ type: String }]
});

module.exports = mongoose.model('Program', ProgramSchema);
