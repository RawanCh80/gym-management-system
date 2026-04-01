const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/adminAuth');
const superAdminAuth = require('../middlewares/superAdminAuth');
console.log('Admin routes file loaded'); // Should appear in terminal when server starts


// Test POST route
router.post('/register', async (req, res) => {
    const { username, password, gymId } = req.body;

    try {
        // Validate required fields
        if (!username || !password || !gymId) {
            return res.status(400).json({
                error: 'username, password and gymId are required'
            });
        }

        // Check if username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({
                error: 'Username already exists'
            });
        }

        // Check if gym exists
        const gym = await Gym.findById(gymId);
        if (!gym) {
            return res.status(404).json({
                error: 'Gym not found'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin linked to existing gym
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            gymId
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin registered successfully',
            admin: newAdmin
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
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

// this will work for the underfuntions
router.use(superAdminAuth);

router.post('/', async (req, res) => {
    try {
        const {username, password, gymId} = req.body;

        if (!username || !password || !gymId) {
            return res.status(400).json({error: 'All required fields must be provided'});
        }

        const existingAdmin = await Admin.findOne({username});
        if (existingAdmin) {
            return res.status(400).json({error: 'username must be unique'});
        }

        const admin = new Admin({username, password, gymId});
        await admin.save();

        res.status(201).json(admin);
    } catch (err) {
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

// =====================
// GET ALL ADMINS
// =====================
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

// =====================
// GET SINGLE ADMIN
// =====================
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({error: 'Admin not found'});

        res.json(admin);
    } catch (err) {
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

// =====================
// UPDATE ADMIN (PUT - all fields required)
// =====================
router.put('/:id', async (req, res) => {
    try {
        const {username, password, gymId} = req.body;
        if (!username || !password || !gymId) {
            return res.status(400).json({error: 'All required fields must be provided'});
        }

        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({error: 'Admin not found'});

        admin.username = username;
        admin.password = password;
        admin.gymId = gymId;

        await admin.save();
        res.json(admin);
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({error: `${field} must be unique`});
        }
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

// =====================
// DELETE ADMIN
// =====================
router.delete('/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({error: 'Admin not found'});

        res.json({message: 'Admin deleted successfully'});
    } catch (err) {
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

module.exports = router;