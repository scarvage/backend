const yahooFinance = require('yahoo-finance2').default;
const CompanyModel = require('../models/companyModel'); // Company model for MongoDB

// Fetch stock price by Yahoo Symbol
async function getStockPriceByYahooSymbol(req, res) {
    const { yahooSymbol } = req.params;

  try {
    // Find company in the database by yahooSymbol
    const company = await CompanyModel.findOne({ yahooSymbol });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Fetch stock data from Yahoo Finance
    const stockData = await yahooFinance.quote(yahooSymbol);

    if (!stockData || !stockData.regularMarketPrice) {
      return res.status(404).json({ message: 'Stock data not available' });
    }

    // Respond with company and stock price
    res.status(200).json({
      company: company.name,
      yahooSymbol: company.yahooSymbol,
      price: stockData.regularMarketPrice,
      currency: stockData.currency,
    });
  } catch (error) {
    console.error('Error fetching stock price:', error);
    res.status(500).json({ message: 'Error fetching stock price' });
  }
}

module.exports = { getStockPriceByYahooSymbol };
