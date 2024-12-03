// models/productValueRecord.model.js

const mongoose = require('mongoose');

const productValueRecordSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  date: { type: Date, default: Date.now },
  totalValue: { type: Number, required: true }
});

module.exports = mongoose.model('ProductValueRecord', productValueRecordSchema);
