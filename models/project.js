const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dateFrom: {
        type: Date,
        required: true,
    },
    dateTo: {
        type: Date,
        required: true,
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
        required: true,
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    }
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);