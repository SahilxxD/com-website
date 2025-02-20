const express = require('express');
const { body } = require('express-validator');
const {protect, isAdmin} = require('../middleware/authMiddleware');
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { processPayment } = require('../controllers/paymentController');

const router = express.Router();

//Place an order
router.post('/payment', protect,
    processPayment
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