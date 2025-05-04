const mongoose = require('mongoose');
const db = require('../config/db');

const QuoteSchema = new mongoose.Schema({
    project_name: { type: String, required: true },
    items: [
        {
            item_number: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    created_at: Date
});

module.exports = mongoose.model('Quote', QuoteSchema);