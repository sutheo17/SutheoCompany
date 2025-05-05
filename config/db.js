/*
    Database config
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SutheoCompany');

module.exports = mongoose;