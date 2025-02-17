const express = require('express');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile (Protected)
// @access  Private
router.get('/profile', protect, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id}!` });
});

module.exports = router;
