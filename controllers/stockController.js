const axios = require('axios');
const Stock = require('../models/stock.model');
require('dotenv').config();

const apiKey = process.env.EOHD_API_KEY; // Replace with your EODHD API key
console.log(apiKey);
const baseUrl = 'https://eodhistoricaldata.com/api/real-time';


const xlsx = require('xlsx');
const path = require('path');
// Function to read tickers from Excel file
const filePath = path.join(__dirname, '../sheets/nse_ticker_list.xlsx'); 

function getTickersFromExcel(filePath) {
    
    try {
        const workbook = xlsx.readFile(filePath); // Read the Excel file
        const sheetName = workbook.SheetNames[0]; // Get the first sheet name
        const worksheet = workbook.Sheets[sheetName]; // Get the first sheet
        const jsonData = xlsx.utils.sheet_to_json(worksheet); // Convert sheet to JSON

        // Extract the 'Code' column and append '.NSE'
        const tickers = jsonData.map(row => `${row.Code}.NSE`);
        return tickers;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return [];
    }
}
// Fetch and update stocks in the database
async function refreshStockData(req, res) {
    try {
        const tickers = getTickersFromExcel(filePath);
        const stockData = [];
        const batchSize = 13; // Adjust based on API limits and performance testing
        
        // Split tickers into batches
        for (let i = 0; i < tickers.length; i += batchSize) {
            const tickerBatch = tickers.slice(i, i + batchSize);
            
            // Create an array of promises for concurrent API calls
            const promises = tickerBatch.map(ticker => {
                const url = `${baseUrl}/${ticker}?api_token=${apiKey}&fmt=json`;
                return axios.get(url)
                    .then(response => {
                        if (response.status === 200) {
                            const { close, previousClose } = response.data;
                            
                            if (typeof close === 'number' && 
                                typeof previousClose === 'number' && 
                                !isNaN(close) && 
                                !isNaN(previousClose)) {
                                    
                                const current_price = close;
                                const percentage_change = ((current_price - previousClose) / previousClose) * 100;
                                
                                // Optional: Keep logging for debugging
                                console.log(`Processed ${ticker}: ${percentage_change.toFixed(2)}%`);
                                
                                return {
                                    ticker,
                                    current_price,
                                    previous_close: previousClose,
                                    percentage_change,
                                };
                            }
                        }
                        return null;
                    })
                    .catch(error => {
                        console.error(`Error fetching ${ticker}:`, error.message);
                        return null;
                    });
            });
            
            // Wait for batch to complete and filter out failed requests
            const batchResults = await Promise.all(promises);
            stockData.push(...batchResults.filter(result => result !== null));
            
            // Optional: Add small delay between batches to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Perform bulk update in the database
        if (stockData.length > 0) {
            const bulkOps = stockData.map((stock) => ({
                updateOne: {
                    filter: { ticker: stock.ticker },
                    update: stock,
                    upsert: true,
                },
            }));

            await Stock.bulkWrite(bulkOps);

            res.status(200).json({
                message: 'Stock data refreshed successfully',
                updatedCount: stockData.length,
            });
        } else {
            res.status(200).json({ message: 'No valid stock data to update' });
        }
    } catch (error) {
        console.error('Error refreshing stock data:', error);
        res.status(500).json({ message: 'Failed to refresh stock data', error });
    }
}


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
