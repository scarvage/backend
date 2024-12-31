// controllers/stockController.js

const axios = require('axios');
const Stock = require('../models/stock.model');
require('dotenv').config();

const apiKey = process.env.EOHD_API_KEY; // Replace with your EODHD API key
const baseUrl = 'https://eodhistoricaldata.com/api/real-time';
const tickers = [
    'RELIANCE.NSE', 'TCS.NSE', 'INFY.NSE', 'ICICIBANK.NSE',
    'HDFCBANK.NSE', 'BAJFINANCE.NSE', 'KOTAKBANK.NSE', 'LT.NSE', 'ITC.NSE'
];

// Fetch and update stocks in the database
async function refreshStockData(req, res) {
    try {
        const stockData = [];

        for (const ticker of tickers) {
            const url = `${baseUrl}/${ticker}?api_token=${apiKey}&fmt=json`;

            const response = await axios.get(url);

            if (response.status === 200 && response.data.close && response.data.previousClose) {
                const current_price = response.data.close;
                const previous_close = response.data.previousClose;
                const percentage_change = ((current_price - previous_close) / previous_close) * 100;

                stockData.push({ ticker, current_price, previous_close, percentage_change });
            }
        }

        // Save or update stocks in the database
        for (const stock of stockData) {
            await Stock.findOneAndUpdate(
                { ticker: stock.ticker },
                stock,
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: 'Stock data refreshed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to refresh stock data', error });
    }
}

// Get top gainers and losers
async function getTopMovers(req, res) {
    try {
        const stocks = await Stock.find();
        if (stocks.length === 0) {
            return res.status(404).json({ message: 'No stock data available' });
        }

        const sortedStocks = stocks.sort((a, b) => b.percentage_change - a.percentage_change);
        const topGainers = sortedStocks.slice(0, 10);
        const topLosers = sortedStocks.slice(-10).reverse();

        res.status(200).json({ topGainers, topLosers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch stock data', error });
    }
}

module.exports = { refreshStockData, getTopMovers };
