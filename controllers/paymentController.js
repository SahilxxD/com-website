const Stripe = require('stripe');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const sendEmail = require('../services/emailService');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
    try {
        const { currency, token } = req.body; // Remove "total" from frontend request
        const userId = req.user.id;

        // Fetch user's cart from the database
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total price from database (not from frontend)
        const totalAmount = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        // Charge customer using Stripe
        const charge = await stripe.charges.create({
            amount: totalAmount * 100, // Convert amount to cents
            currency,
            source: token,
            description: 'E-Commerce Order Payment'
        });

        // Save order only if payment is successful
        const order = new Order({
            user: userId,
            items: cart.items,
            total: totalAmount,
            paymentId: charge.id,
            status: 'Paid'
        });

        await order.save();

        // Fetch user details
        const user = await User.findById(req.user.id);

        // Send order confirmation email
        await sendEmail(user.email, 'Order Confirmation', '../templates/orderConfirmation.ejs', {
            name: user.name,
            orderId: order._id,
            items: cart.items,
            total: totalAmount,
        });

        // Clear user cart after successful payment
        await Cart.deleteOne({ user: userId });

        res.status(200).json({ success: true, order, message: 'Payment successful and order created!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
