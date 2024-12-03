const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  funds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fund' }]
});

module.exports = mongoose.model('Product', productSchema);
