// models/Stock.js

const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    ticker: { type: String, required: true },
    current_price: { type: Number, required: true },
    previous_close: { type: Number, required: true },
    percentage_change: { type: Number, required: true },
});

module.exports = mongoose.model('Stock', stockSchema);
