const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtils'); 
const subscriptionController = require('../controllers/subscription.controller');

router.post('/create-subscription', subscriptionController.createSubscription);
router.post('/add-product/:subscriptionId',subscriptionController.addProductToSubscription);
router.get('/', subscriptionController.getSubscriptions);
router.get('/:subscriptionId', subscriptionController.getSubscriptionById);
router.put('/add-product/:subscriptionId/:productId', subscriptionController.addProductToSubscription);

module.exports = router;
