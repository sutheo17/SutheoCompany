/*
    Customer collection
 */

const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Customer = db.model('Customer', new Schema({
    name: String,
    email: String,
    county: String,
    city: String,
    zip: Number,
    address: String,
    phone: String
}));

module.exports = Customer;