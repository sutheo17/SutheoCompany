const Schema = require('mongoose').Schema;
const db = require('../config/db');
const Product = require("./product");

const Transaction = db.model('Transaction', new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: { type: Date, default: Date.now },
    _product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number,
    size: {
        height: Number,
        width: Number
    }
}));

module.exports = Transaction;