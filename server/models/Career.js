const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    outlook: { type: String },
    education: { type: String },
    salary: { type: String },
    category: { type: String }
});

module.exports = mongoose.model('Career', CareerSchema);
