const Product = require('../models/product.model');
const Fund = require('../models/fund.model');
const Company = require('../models/companyModel');
const axios = require('axios'); 

// Function to add a fund to a product
exports.addFundToProduct = async (req, res) => {
  const { productId } = req.params;
  const { companyName, allocationPercent, entryPrice } = req.body;

  try {
    // Step 1: Fetch fund details from the Company collection
    const company = await Company.findOne({ nameOfCompany: companyName });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Step 2: Fetch fund price from the Yahoo Finance API
    const yahooSymbol = company.yahooSymbol;
    const yfinanceResponse = await axios.get(`http://localhost:3000/api/yfinance/${yahooSymbol}`);
    
    const fundPrice = yfinanceResponse.data.price;
    if (!fundPrice) {
      return res.status(400).json({ message: 'Price not found for the fund' });
    }

    // Calculate investment and number of shares based on the entry price and allocation percentage
    const startingCapital = 100000; // Example starting capital; replace with actual capital as needed
    const investment = (allocationPercent / 100) * startingCapital;
    const numberOfShares = investment / entryPrice;
    const latestValue = numberOfShares * fundPrice;

    // Step 3: Create a new Fund object
    const newFund = new Fund({
      name: company.nameOfCompany,
      nseSymbol: company.nseSymbol,
      price: fundPrice,
      navValue: fundPrice,
      profitLossPercent: 0,
      allocationPercent,
      entryPrice,
      investment,
      numberOfShares,
      latestValue
    });

    // Step 4: Save the new fund to the database
    const savedFund = await newFund.save();

    // Step 5: Add the new fund to the product's funds array
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.funds.push(savedFund._id);
    await product.save();

    // Step 6: Return success response
    return res.status(200).json({
      message: 'Fund added to product successfully',
      product,
      fund: savedFund
    });
  } catch (error) {
    console.error('Error adding fund to product:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all funds
exports.getAllFunds = async (req, res) => {
  try {
    const funds = await Fund.find();
    return res.status(200).json(funds);
  } catch (error) {
    console.error('Error fetching funds:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Function to get fund details by ID
exports.getFundDetails = async (req, res) => {
  const { fundId } = req.params;
  try {
    const fund = await Fund.findById(fundId);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    return res.status(200).json(fund);
  } catch (error) {
    console.error('Error fetching fund details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete a fund by ID
exports.deleteFund = async (req, res) => {
  const { fundId } = req.params;
  try {
    const fund = await Fund.findByIdAndDelete(fundId);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    return res.status(200).json({ message: 'Fund deleted successfully' });
  } catch (error) {
    console.error('Error deleting fund:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
