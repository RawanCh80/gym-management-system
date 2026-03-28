const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'secretKey'); // Must match the key you used when signing
        req.adminId = decoded.id; // Add admin ID to request object for later use
        next(); // Pass control to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;