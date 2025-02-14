const express = require('express');
const {body} = require('express-validator');
const {signup, login} = require('../controllers/authController')

const router = express.Router();

router.post(
    '/signup',
    [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({min:6}).withMessage('Password must be at least 6 chanracter long')
    ],
    signup
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').not().isEmpty().withMessage('Password is required'),
    ],
    login
);

module.exports = router;
