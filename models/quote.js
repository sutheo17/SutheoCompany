/*
    Quote collection
 */

const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Quote = db.model('Quote', new Schema({
    project_name: String,
    profit: Number,
    calculated_price: Number,
    final_price: Number,
    items: [
        {
            item_number: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    created_at: Date
}));

module.exports = Quote