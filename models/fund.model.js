
const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nseSymbol: { type: String, required: true },
  price: { type: Number },
  navValue: { type: Number },
  profitLossPercent: { type: Number },
  allocationPercent: { type: Number }, // % Allocation
  entryPrice: { type: Number }, // Entry Price
  investment: { type: Number }, // Investment
  numberOfShares: { type: Number }, // # of Shares
  latestValue: { type: Number }, // Latest Value
  icon: { type: String } // Store the path to the icon
});

module.exports = mongoose.model('Fund', fundSchema);