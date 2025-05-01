const Schema = require('mongoose').Schema;
const db = require('../config/db');

const User = db.model('User', {
    username: String,
    password: String,
    name: String,
    email: String,
    leader: Boolean
});

module.exports = User;