const express = require('express');
const router = express.Router();
const { acceptJobOrOrder } = require('../Controllers/userMarketController');
const userMarketController = require('../Controllers/userMarketController');

// userId is passed in params
router.post('/:userId/add', acceptJobOrOrder);
router.get('/:userId/getMyOrder', userMarketController.getMyOrders);

module.exports = router;
