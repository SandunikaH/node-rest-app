const express = require('express');
const router = express.Router();
const checkAuth = require('../auth/check-auth'); 

const ordersController = require('../controllers/orders');

// any url starting with /product will be handled by this file. Hence no need to specidy /product here again. Instead, use url after /product
router.get('/', checkAuth, ordersController.getAllOrders);

router.post('/', checkAuth, ordersController.createOrder);

router.get('/:orderId', checkAuth, ordersController.getOrder);

router.patch('/:orderId', checkAuth, ordersController.updateOrder);

router.delete('/:orderId', checkAuth, ordersController.deleteOrder);

module.exports = router;