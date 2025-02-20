const express = require('express');
const { addProduct, getAllProduct, getProduct, editProduct, deleteProduct } = require('../controllers/productController');
const {protect, isAdmin} = require('../middleware/authMiddleware');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../config/multerConfig');

router.post('/',
    isAdmin,
    protect,
    upload.single('image'), // Multer middleware to handle single file upload
    [
        body('name').not().isEmpty().withMessage('Product name is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('description').not().isEmpty().withMessage('Description is required'),
        body('category').not().isEmpty().withMessage('Product category is required'),
        body('stock').isNumeric().withMessage('Stock must be a number'), 
    ],
    addProduct
)

router.get('/',
    getAllProduct
)

router.get('/:id',
    getProduct
)

router.put('/:id',
    protect,
    isAdmin,
    editProduct
)

router.delete('/:id',
    protect,
    isAdmin,
    deleteProduct
)

module.exports = router;
