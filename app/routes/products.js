const express = require('express');
const router = express.Router();
const checkAuth = require('../auth/check-auth');

const productController = require('../controllers/products');

// any url starting with /product will be handled by this file. Hence no need to specidy /product here again. Instead, use url after /product
router.get('/', checkAuth, productController.getAllProducts);

// handling post requests
router.post('/', checkAuth, productController.addProduct);

router.get('/:productId', checkAuth, productController.getProduct);

router.patch('/:productId', checkAuth, productController.updateProduct);

router.delete('/:productId', checkAuth, productController.deleteProduct);

module.exports = router;