const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Route for getting all products (originally '/products')
router.get('/products', productController.getAllProducts);

// Route for getting product by SKU (originally '/product/:sku')
router.get('/product/:sku', productController.getProductBySKU);

// Route for getting products by category (originally '/products/:cat')
router.get('/products/:cat', productController.getProductsByCategory);

// Route for getting all categories (originally '/categories')
router.get('/categories', productController.getAllCategories);

// Route for searching products by text (originally '/search/:text')
router.get('/search/:text', productController.searchProducts);

module.exports = router;
