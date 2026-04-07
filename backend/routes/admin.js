const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Gym = require('../models/Gym');
const superAdminAuth = require('../middlewares/superAdminAuth');
console.log('Admin routes file loaded'); // Should appear in terminal when server starts


// Test POST route
router.post('/register', superAdminAuth, async (req, res) => {
    const {username, password, gymId} = req.body;

    try {
        // Validate required fields
        if (!username || !password || !gymId) {
            return res.status(400).json({
                error: 'username, password and gymId are required'
            });
        }

        // Check if username already exists
        const existingAdmin = await Admin.findOne({username});
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
        if (!username || !password) {
            return res.status(400).json({error: 'Username and password are required'});
        }

        const admin = await Admin.findOne({username}).populate('gymId');

        if (!admin) {
            return res.status(404).json({error: 'Admin not found'});
        }

        if (!admin.gymId) {
            return res.status(400).json({error: 'Admin is not linked to a gym'});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({error: 'Invalid password'});
        }

        const token = jwt.sign(
            {id: admin._id, gymId: admin.gymId._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.json({
            message: 'Login successful!',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                gymId: admin.gymId._id,
                gymName: admin.gymId.gymName
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

// this will work for the underfuntions
router.use(superAdminAuth);

router.post('/', async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'All required fields must be provided'
            });
        }

        const existingAdmin = await Admin.findOne({username});

        if (existingAdmin) {
            return res.status(400).json({
                error: 'username must be unique'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            username,
            password: hashedPassword,
            gymId: req.gymId
        });

        await admin.save();

        res.status(201).json(admin);

    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});
// =====================
// GET ALL ADMINS
// =====================
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find({
            gymId: req.gymId
        });

        res.json(admins);

    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});

// =====================
// GET SINGLE ADMIN
// =====================
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.findOne({
            _id: req.params.id,
            gymId: req.gymId
        });

        if (!admin) {
            return res.status(404).json({
                error: 'Admin not found in this gym'
            });
        }

        res.json(admin);

    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});

// =====================
// UPDATE ADMIN (PUT - all fields required)
// =====================
router.put('/:id', async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'All required fields must be provided'
            });
        }

        const admin = await Admin.findOne({
            _id: req.params.id,
            gymId: req.gymId
        });

        if (!admin) {
            return res.status(404).json({
                error: 'Admin not found in this gym'
            });
        }

        admin.username = username;
        // Only hash if password changed
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;


        await admin.save();

        res.json(admin);

    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});

// =====================
// DELETE ADMIN
// =====================
router.delete('/:id', async (req, res) => {
    try {
        const admin = await Admin.findOneAndDelete({
            _id: req.params.id,
            gymId: req.gymId
        });

        if (!admin) {
            return res.status(404).json({
                error: 'Admin not found in this gym'
            });
        }

        res.json({
            message: 'Admin deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});

module.exports = router;