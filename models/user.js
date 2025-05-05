/*
    User collection
 */
const Schema = require('mongoose').Schema;
const db = require('../config/db');

const User = db.model('User', new Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    leader: Boolean
}));

module.exports = User;