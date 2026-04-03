const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    fullName: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    packages: [
        {
            packageName: {type: String, required: true},
            durationDays: {type: Number, required: true},
            numberOfSessions: {type: Number, required: true},
            price: {type: Number, required: true},

            startDate: {type: Date, required: true},
            endDate: {type: Date, required: true},

            isActive: {type: Boolean, default: true},
            notes: String,
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date
            }
        }
    ],
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model('Member', memberSchema);