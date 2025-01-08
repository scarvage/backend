const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  subDescription: { type: String },
  type: { type: String, required: true }, // e.g., 'Mutual Fund', 'ETF', etc.
  subtype: { type: String }, // e.g., 'Large Cap', 'Mid Cap', 'Debt', etc.
  risk: { type: String, required: true }, // e.g., 'High', 'Medium', 'Low'
  iconImage: { type: String }, // Store the path to the icon image
  funds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fund' }]
});

module.exports = mongoose.model('Product', productSchema);