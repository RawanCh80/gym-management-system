const express = require('express');
const router = express.Router();
const SuperAdmin = require('../models/SuperAdmin');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const admin = await SuperAdmin.findOne({ username });
		if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

		const isMatch = await admin.comparePassword(password);
		if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

		// Generate JWT token
		const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

		res.json({ message: 'Login successful', token });
	} catch (err) {
		res.status(500).json({ error: 'Server error', details: err.message });
	}
});

module.exports = router;