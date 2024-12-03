const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dailyPortfolioValue: { type: Number, required: true },
  percentChange: { type: Number, required: true },
  funds: [
    {
      name: String,
      allocation: Number,
      entryPrice: Number,
      investment: Number,
      shares: Number,
      currentPrice: Number,
      latestValue: Number,
    },
  ],
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
