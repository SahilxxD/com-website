const express = require('express');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User'); 

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile (Protected)
// @access  Private
router.get('/profile', protect, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id}!` });
});

// Route to delete all users
router.delete('/delete-all-users', async (req, res) => {
    try {
        // Deleting all users from the database
        await User.deleteMany({});
        res.status(200).json({ message: 'All users have been deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting users', error });
    }
});

module.exports = router;
