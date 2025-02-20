const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User')
const sendEmail = require('../services/emailService');

// exports.createOrder = async(req, res) => {
//     try {
//         const {items, total} = req.body;

//         if(!items || items.length === 0) {
//             return res.status(400).json({message: 'No items in order'});
//         }
        
//         const order = new Order({
//             user: req.user.id,
//             items,
//             total
//         });

//         await order.save();

//         // Fetch user details
//         const user = await User.findById(req.user.id);

//         // Send order confirmation email
//         await sendEmail(user.email, 'Order Confirmation', '../templates/orderConfirmation.ejs', {
//             name: user.name,
//             orderId: order._id,
//             items: items,
//             total,
//         });

//         // Clear user cart after placing an order
//         await Cart.deleteOne({ user: req.user.id });

//         res.status(201).json(order)
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.user.id});
        res.json(orders)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user','name email').populate('item-product');
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async(req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if(!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        order.status = req.body.status;
        await order.save();

        res.json({message: 'Order status updated', order})
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
}