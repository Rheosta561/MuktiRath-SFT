const express = require('express');
const router = express.Router();
const productController = require('../Controllers/ProductController');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts); // supports ?search=keyword
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
