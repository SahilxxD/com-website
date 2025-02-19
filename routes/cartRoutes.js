const express = require('express');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware')
const { addCart, viewCart, removeFromCart, updateCart } = require('../controllers/cartController');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');


router.post('/add',
    protect,
    [
        body('productId')
            .isMongoId().withMessage('Invalid product ID format'),
        body('quantity')
            .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    validate,
    addCart);
router.get('/',protect,
    validate,
    viewCart);
router.delete(':productId', protect,
    [
        body('productId')
            .isMongoId().withMessage('Invalid product ID format'),
        body('quantity')
            .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    validate,
    removeFromCart);
router.put('/update',protect, updateCart);

module.exports = router;