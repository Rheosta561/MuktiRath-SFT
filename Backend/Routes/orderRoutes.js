const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderController');

router.get('/', orderController.viewOrders);
router.get('/allOrders', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.put('/:orderId/accept', orderController.acceptOrder);
router.put('/:orderId/reject', orderController.rejectOrder);
router.put('/:orderId/status', orderController.updateOrderStatus);
router.delete('/delete', orderController.deleteAllOrders);

module.exports = router;
