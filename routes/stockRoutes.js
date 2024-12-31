// routes/stockRoutes.js

const express = require('express');
const { refreshStockData, getTopMovers } = require('../controllers/stockController');

const router = express.Router();

// GET request to fetch top gainers and losers
router.get('/top-movers', getTopMovers);

// PUT request to refresh stock data
router.put('/refresh', refreshStockData);

module.exports = router;
