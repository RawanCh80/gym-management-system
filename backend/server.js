// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
//
// // A Node.js framework that makes it easy to create servers and handle routes (HTTP requests).
// // cors → Middleware that allows your frontend (maybe on another port or domain) to talk to your backend without security errors.
// const app = express();
// // app is your Express application. It handles routes, middleware, and server logic.
//
// app.use(cors());
// //Enables CORS (Cross-Origin Resource Sharing) so your frontend (like React, Angular, or Ionic) can make requests to this server.
// app.use(express.json());
// // ells the server to automatically parse incoming JSON in request bodies, so you can access it via req.body.
//
// const adminRoutes = require('./routes/admin');
//
// mongoose.connect('mongodb://127.0.0.1:27017/gymDB')
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));
//
// // Test route
// app.get('/', (req, res) => {
//     res.send('Gym Backend is running 💪');
// });
//
// app.use('/api/admin', adminRoutes);
// //use admin routes
//
// // Members route
// app.get('/api/members', (req, res) => {
//     res.json([]);
// });
//
// const PORT = 3000;
//
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
// // start the server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Import admin routes
const adminRoutes = require('./routes/admin');

// Use admin routes
app.use('/admin', adminRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gymDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Test route
app.get('/', (req, res) => res.send('Gym Backend is running 💪'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));