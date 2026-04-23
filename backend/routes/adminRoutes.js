const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Gym = require('../models/Gym');
const mongoose = require('mongoose');
const superAdminAuth = require('../middlewares/superAdminAuth');
const authMiddleware = require('../middlewares/adminAuth');
console.log('Admin routes file loaded'); // Should appear in terminal when server starts

router.post('/register', superAdminAuth, async (req, res) => {
    const {username, email, password, gymId} = req.body;

    try {
        // Validate required fields
        if (!username || !email || !password || !gymId) {
            return res.status(400).json({
                error: 'username, email, password and gymId are required'
            });
        }


        if (!mongoose.Types.ObjectId.isValid(gymId)) {
            return res.status(400).json({error: 'Invalid gymId'});
        }

        // Check if gym exists
        const gym = await Gym.findById(gymId);
        if (!gym) {
            return res.status(404).json({
                error: 'Gym not found'
            });
        }

        const existingAdmin = await Admin.findOne({
            username,
            gymId
        });
        if (existingAdmin) {
            return res.status(400).json({
                error: 'Username already exists in this gym'
            });
        }

        const existingAdminByEmail = await Admin.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingAdminByEmail) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin linked to existing gym
        const newAdmin = new Admin({
            username,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            gymId: new mongoose.Types.ObjectId(gymId)
        });

        await newAdmin.save();

        const adminResponse = newAdmin.toObject();
        delete adminResponse.password;


        res.status(201).json({
            message: 'Admin registered successfully',
            admin: adminResponse
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
    const {email, password} = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find admin by email and populate gymId
        const admin = await Admin.findOne({
            email: email.trim().toLowerCase()
        }).populate('gymId');

        if (!admin.password) {
            return res.status(500).json({
                error: 'Admin password is missing in database'
            });
        }
        if (!admin) {
            return res.status(404).json({
                error: 'Admin not found'
            });
        }

        if (!admin.gymId) {
            return res.status(400).json({error: 'Admin is not linked to a gym'});
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({error: 'Invalid password'});
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                gymId: admin.gymId._id
            },
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

/// update password by admin it self
router.put('/:id/password', authMiddleware, async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({error: 'Old and new passwords are required'});
    }

    const admin = await Admin.findOne({
        _id: req.params.id
    });
    if (!admin) return res.status(404).json({error: 'Admin not found'});

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({error: 'Old password is incorrect'});

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({message: 'Password updated successfully'});
});

// this will work for the underfuntions
router.use(superAdminAuth);

// =====================
// GET ALL ADMINS
// =====================
router.get('/', async (req, res) => {
    try {
        const {gymId} = req.query;

        if (!gymId) {
            return res.status(400).json({error: 'gymId query parameter is required'});
        }

        if (!mongoose.Types.ObjectId.isValid(gymId)) {
            return res.status(400).json({error: 'Invalid gymId'});
        }

        const admins = await Admin.find({gymId: new mongoose.Types.ObjectId(gymId)}).select('-password');

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
        const admin = await Admin.findById(req.params.id).select('-password');


        if (!admin) {
            return res.status(404).json({
                error: 'Admin not found'
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
// UPDATE ADMIN (PUT - username and email)
// =====================
router.put('/:id', async (req, res) => {
    try {
        const { username, email, gymId } = req.body;

        if (!username || !email) {
            return res.status(400).json({
                error: 'All required fields must be provided'
            });
        }

        const admin = await Admin.findOne({
            _id: req.params.id,
            gymId: gymId
        });

        if (!admin) {
            return res.status(404).json({
                error: 'Admin not found in this gym'
            });
        }

        const existingUsername = await Admin.findOne({
            username: username.trim(),
            gymId: req.gymId,
            _id: {$ne: req.params.id}
        });

        if (existingUsername) {
            return res.status(400).json({
                error: 'Username already exists in this gym'
            });
        }

        const existingEmail = await Admin.findOne({
            email: email.trim().toLowerCase(),
            _id: {$ne: req.params.id}
        });

        if (existingEmail) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        admin.username = username;
        admin.email = email.trim().toLowerCase();
        // Only hash if password changed

        await admin.save();

        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.json(adminResponse);
    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});

//update password by the superadmin
// PUT /admins/:id/password/reset
router.put('/:id/password/reset', async (req, res) => {
    const {newPassword} = req.body;

    if (!newPassword) {
        return res.status(400).json({error: 'New password is required'});
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({error: 'Admin not found'});

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({message: 'Password reset successfully by super admin'});
});

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid admin ID'});
        }

        const admin = await Admin.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({error: 'Admin not found'});
        }

        res.json({message: 'Admin deleted successfully'});

    } catch (err) {
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

module.exports = router;
