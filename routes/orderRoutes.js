const express = require('express');
const { body } = require('express-validator');
const {protect, isAdmin} = require('../middleware/authMiddleware');
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

//Place an order
router.post('/', protect,
    [
        body('items').isArray({ min: 1 }).withMessage('At least one product is required'),
        body('total').isNumeric().withMessage('Total amount must be a number'),
    ],
    createOrder
);

//Get orders for logged-in user
router.get('/',protect,getUserOrders);

//get all orders
router.get('/all', protect, getAllOrders);

//update order status
router.put('/:id', protect, isAdmin,
    [
        body('status').isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid order status'),
    ],
    updateOrderStatus
)

module.exports = router;