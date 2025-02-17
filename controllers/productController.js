const Product = require('../models/Product');
const {body, validationResult } = require('express-validator');

exports.addProduct = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    try {
        const {name, price, description, image, category, stock} = req.body;

        const newProduct = new Product({
            name,
            price,
            description,
            image,
            category,
            stock
        });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: 'Server Error'})
    }
}

exports.getAllProduct = async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
}

exports.getProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message: 'Product not found'})
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error'});
    }
}

exports.editProduct = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(401).json({ message: 'Product not found' });
        }

        const {name, price, description, image, category, stock} = req.body;
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        await product.save();

        res.json(product)
    } catch (err) {
        res.status(500).json({ message: 'Server Error'})
    }
};

exports.deleteProduct = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();
        res.json({message: 'Product deleted'})
    } catch (err) {
        res.status(500).json({message: 'Server error'});
    }
}
