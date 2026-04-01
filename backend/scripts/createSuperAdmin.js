require('dotenv').config();
const mongoose = require('mongoose');
const SuperAdmin = require('../models/SuperAdmin');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const createSuperAdmin = async () => {
    const existing = await SuperAdmin.findOne({ username: process.env.SUPERADMIN_USERNAME });
    if (existing) return console.log('Super admin already exists');

    const admin = new SuperAdmin({
        username: process.env.SUPERADMIN_USERNAME,
        password: process.env.SUPERADMIN_PASSWORD
    });

    await admin.save();
    console.log('Super admin created successfully!');
    process.exit();
};

createSuperAdmin();