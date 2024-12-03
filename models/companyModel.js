const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  nseSymbol: { type: String, required: true },
  yahooSymbol: { type: String, required: true },
  isinNumber: { type: String, required: true },
  nameOfCompany: { type: String, required: true },
  industry: { type: String, required: true },
});

module.exports = mongoose.model('Company', companySchema);
