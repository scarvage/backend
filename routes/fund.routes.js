const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fund.controller');
const { verifyToken } = require('../utils/jwtUtils');

// Route to add a fund to a product
router.post('/add-fund/:productId', fundController.addFundToProduct);

// Route to get all funds
router.get('/', fundController.getAllFunds);

// Route to get fund details
router.get('/:fundId', fundController.getFundDetails);

// Route to delete a fund by ID
router.delete('/:fundId', fundController.deleteFund);

module.exports = router;
