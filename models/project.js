/*
    Project collection
 */
const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Project = db.model('Project', new Schema({
    name: String,
    dateFrom: Date,
    dateTo: Date,
    quote: {
        type: Schema.Types.ObjectId,
        ref: 'Quote',
        required: true,
    },
    team: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    }
}));

module.exports = Project