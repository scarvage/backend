const Product = require('../models/product.model');
const Fund = require('../models/fund.model');
const Company = require('../models/companyModel');
const axios = require('axios'); 
const ProductValueRecord = require('../models/productValueRecord.model')
exports.refreshFundsInProduct = async (req, res) => {
  const { productId } = req.params;
  console.log("Received request to refresh funds for product:", productId);

  try {
    const product = await Product.findById(productId).populate('funds');
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("Product found:", product.name);

    for (const fund of product.funds) {
      console.log(`Processing fund: ${fund.name} (NSE Symbol: ${fund.nseSymbol})`);

      // Find company details to get the Yahoo symbol
      const company = await Company.findOne({ nseSymbol: fund.nseSymbol });
      if (!company) {
        console.log(`Company not found for fund: ${fund.name}`);
        continue; // Skip if no company details
      }

      const yahooSymbol = company.yahooSymbol;
      try {
        const yfinanceResponse = await axios.get(`http://localhost:3000/api/yfinance/${yahooSymbol}`);
        const currentPrice = yfinanceResponse.data.price;
        // console.log(`Fetched price for ${fund.name}:`, currentPrice);

        // Check if currentPrice, allocationPercent, and entryPrice are valid numbers
        if (!currentPrice || isNaN(currentPrice)) {
          console.log(`Invalid currentPrice for ${fund.name}`);
          continue;
        }
        if (!fund.allocationPercent || isNaN(fund.allocationPercent) || fund.allocationPercent === 0) {
          console.log(`Invalid allocationPercent for ${fund.name}`);
          continue;
        }
        if (!fund.entryPrice || isNaN(fund.entryPrice) || fund.entryPrice === 0) {
          console.log(`Invalid entryPrice for ${fund.name}`);
          continue;
        }
        const startingCapital = 100000;
        // Calculate values
        const investment = (fund.allocationPercent / 100) * startingCapital;
        // console.log(product.startingCapital)
        const numShares = investment / fund.entryPrice;
        const latestValue = currentPrice * numShares;

        // Validate the calculated values
        if (isNaN(investment) || isNaN(numShares) || isNaN(latestValue)) {
          console.log(`Calculation resulted in NaN for fund ${fund.name}`);
          console.log(`allocationPercent: ${fund.allocationPercent}, entryPrice: ${fund.entryPrice}, currentPrice: ${currentPrice}`);
          continue;
        }

        // Update fund fields
        const updatedFund = await Fund.findByIdAndUpdate(fund._id, {
          price: currentPrice,
          investment,
          numShares,
          latestValue,
          profitLossPercent: ((latestValue - investment) / investment) * 100,
        }, { new: true });

        // console.log(`Updated fund ${fund.name} with new values:`);
      } catch (error) {
        console.log(`Error fetching price for ${fund.name} (${yahooSymbol}):`, error.message);
      }
    }

    console.log("All funds updated successfully.");
    return res.status(200).json({ message: 'Funds updated successfully' });
  } catch (error) {
    console.error("Error in refreshFundsInProduct:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};




// Function to calculate and save daily total value for a product
exports.updateDailyValue = async (req, res) => {
  const { productId } = req.params;

  try {
    // Step 1: Fetch the product and populate funds
    const product = await Product.findById(productId).populate('funds');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Step 2: Calculate the sum of latest values for all funds in the product
    const totalValue = product.funds.reduce((acc, fund) => acc + fund.latestValue, 0);

    // Step 3: Create a new record in the ProductValueRecord collection
    const newRecord = new ProductValueRecord({
      productId: product._id,
      date: new Date(),
      totalValue: totalValue
    });

    await newRecord.save();

    // Step 4: Return a success response
    return res.status(200).json({
      message: 'Daily total value recorded successfully',
      record: newRecord
    });
  } catch (error) {
    console.error('Error recording daily total value:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add fund to product
exports.addFundToProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    const fund = await Fund.findById(req.body.fundId);
    if (!product || !fund) return res.status(404).json({ message: 'Product or fund not found' });

    product.funds.push(fund._id);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('funds');
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('funds');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductDailyValue = async (req,res) =>{
  try {
    const dailyValues = await ProductValueRecord.findById(req.params.productId).populate('productvaluerecords');
    if(!dailyValues)return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(dailyValues);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


