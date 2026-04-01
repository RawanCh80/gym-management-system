const express = require('express');
const router = express.Router();
const Gym = require('../models/Gym');
const superAdminAuth = require("../middlewares/superAdminAuth");

router.use(superAdminAuth);
// -----------------------------
// CREATE a new Gym
router.post('/', async (req, res) => {
    try {
        const { gymName, ownerName, phone, email, address, subscriptionPlan } = req.body;

        if (!gymName || !ownerName || !phone || !email || !address) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const existingGym = await Gym.findOne({ gymName });
        if (existingGym) {
            return res.status(400).json({ error: 'gymName must be unique' });
        }

        const gym = new Gym({ gymName, ownerName, phone, email, address, subscriptionPlan });
        await gym.save();
        res.status(201).json(gym);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// -----------------------------
// GET all gyms
router.get('/', async (req, res) => {
    try {
        const gyms = await Gym.find();
        res.json(gyms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// GET a single gym by ID
router.get('/:id', async (req, res) => {
    try {
        const gym = await Gym.findById(req.params.id);
        if (!gym) return res.status(404).json({ error: 'Gym not found' });
        res.json(gym);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// UPDATE a gym by ID
router.put('/:id', async (req, res) => {
    try {
        const { gymName, ownerName, phone, email, address, subscriptionPlan, isActive } = req.body;

        // Validation for required fields
        if (!gymName || !ownerName || !phone || !email || !address) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const updatedGym = await Gym.findByIdAndUpdate(
            req.params.id,
            { gymName, ownerName, phone, email, address, subscriptionPlan, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedGym) return res.status(404).json({ error: 'Gym not found' });
        res.json(updatedGym);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// -----------------------------
// DELETE a gym by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedGym = await Gym.findByIdAndDelete(req.params.id);
        if (!deletedGym) return res.status(404).json({ error: 'Gym not found' });
        res.json({ message: 'Gym deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;