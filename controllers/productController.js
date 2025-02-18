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
        let query = {};

        // 🔹 Filtering by Category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // 🔹 Filtering by Price Range
        if (req.query.minPrice && req.query.maxPrice) {
            query.price = { $gte: Number(req.query.minPrice), $lte: Number(req.query.maxPrice) };
        }

        let sort = {};
        if(req.query.sort){
            const sortField = req.query.sort.replace('-','');
            sort[sortField] = req.query.sort.startsWith('-') ? -1 : 1; // Ascending or Descending
        }

        // 🔹 Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query)

        res.json({
            success: true,
            totalPage: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts,
            products,
        });
    } catch (err) {
        res.status(500).json({message: err.message});
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
