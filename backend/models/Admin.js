const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    }
});
adminSchema.index({username: 1, gymId: 1}, {unique: true});
module.exports = mongoose.model('Admin', adminSchema);