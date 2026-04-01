const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    gymName: {
        type: String,
        required: true,
        unique: true
    },

    ownerName: {
        type: String
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    subscriptionPlan: {
        type: String,
        default: 'basic'
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Gym', gymSchema);