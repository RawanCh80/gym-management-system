const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    gymName: {
        type: String,
        required: true
    },

    ownerName: {
        type: String
    },

    phone: {
        type: String
    },

    email: {
        type: String,
        unique: true
    },

    address: {
        type: String
    },

    subscriptionPlan: {
        type: String,
        default: 'basic'
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Gym', gymSchema);