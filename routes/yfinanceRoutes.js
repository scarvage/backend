const express = require('express');
const router = express.Router();
const { getStockPriceByYahooSymbol } = require('../controllers/yfinanceController.js');
const { verifyToken } = require('../utils/jwtUtils');

router.get('/:yahooSymbol', getStockPriceByYahooSymbol);

module.exports = router;
