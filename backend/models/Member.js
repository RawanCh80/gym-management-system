const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    fullName: {type: String, required: true, unique: true},
    phone: String,

    membershipName: {type: String, required: false}, // e.g. "Monthly Plan"
    durationDays: {type: Number, required: true},   // e.g. 30
    numberOfSessions: {type: Number, required: true}, // e.g. 10
    price: {type: Number, required: true},

    membershipStart: {type: Date, required: true},
    membershipEnd: Date,

    isActive: {type: Boolean, default: true},
    notes: String,
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model('Member', memberSchema);