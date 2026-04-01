const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/adminAuth');

console.log('Admin routes file loaded'); // Should appear in terminal when server starts

// Test GET route
router.get('/test', (req, res) => {
    res.send('Admin route works!');
});

// Test POST route
router.post('/register', async (req, res) => {
    const {username, password ,gymname} = req.body;

    try {
        const existingAdmin = await Admin.findOne({$or: [{username}]});
        if (existingAdmin) return res.status(400).json({error: 'Username already exists'});

        const newGym = new Gym({
            name: gymName
        });

        await newGym.save();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({username, password: hashedPassword, gymId: newGym._id});
        await newAdmin.save();

        res.status(201).json({message: 'Admin registered successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const admin = await Admin.findOne({username});
        if (!admin) return res.status(404).json({error: 'Admin not found'});

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({error: 'Invalid password'});

        const token = jwt.sign({
            id: admin._id,
            gymId: admin.gymId
        }, 'secretKey', {expiresIn: '1h'});

        res.json({
            message: 'Login successful!',
            token: token,
            admin: {
                id: admin._id,
                username: admin.username,
                gymId: admin.gymId
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!', adminId: req.adminId });
});

module.exports = router;