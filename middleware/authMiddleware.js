const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async(req, res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({message: 'Access denied: No token provided'});
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ',''), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id)
        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid or expired token.'});
    }
}

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};


module.exports = {protect, isAdmin};