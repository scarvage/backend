const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: '5m', default: Date.now }, // OTP expires after 5 minutes
});

const OTPModel = mongoose.model('OTP', OTPSchema);

module.exports = OTPModel;
