const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Import admin routes
const adminRoutes = require('./routes/admin');
// Use admin routes

app.use('/admins', adminRoutes);
const memberRoutes = require('./routes/memberRoutes');
console.log("✅ memberRoutes imported");

app.use('/members', memberRoutes);
console.log("📌 /members route registered");


const gymRoutes = require('./routes/gymRoutes');
app.use('/gyms', gymRoutes);

const superAdminAuthRoutes = require('./routes/superAdminAuth');
app.use('/super-admin', superAdminAuthRoutes);
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gymDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Test route
app.get('/', (req, res) => res.send('Gym Backend is running 💪'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));