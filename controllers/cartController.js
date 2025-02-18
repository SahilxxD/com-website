const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addCart = async (req, res) => {
    const {productId, quantity} = req.body;
    try {
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({message: 'Product not fount'});
        }

        let cart = await Cart.findOne({user: req.user.id});
        if(!cart){
            cart = new Cart({
                user: req.user.id,
                items: [],
                total: 0
            })
        }
        
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        
        if (productIndex > -1){
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity})
        }
        // 🔹 Populate product details before calculating total
        await cart.populate('items.product');

        cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

exports.viewCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user.id}).populate('items.product');
        if(!cart) {
            return res.status(404).json({message: 'Cart not found'});
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.removeFromCart = async (req, res) => {
    const {productId} = req.params;
    try {
        let cart = await Cart.findOne({user: req.user.id});
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the product to be removed
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // 🔹 Populate product details before recalculating total
        await cart.populate('items.product');

        // Recalculate Total price
        cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.updateCart = async(req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart and update quantity
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        
        cart.items[productIndex].quantity = quantity;

        // 🔹 Populate product details before recalculating total
        await cart.populate('items.product');

        // Recalculate total price
        cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}