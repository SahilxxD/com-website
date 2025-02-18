const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    }
});

// 🔹 Create Full-Text Index on `name` and `description`
ProductSchema.index({name: 'text', description: 'text'});

module.exports = mongoose.model('Product', ProductSchema);