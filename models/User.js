const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  dob: { type: Date },
  panNo: { type: String, default: "" },
  mobileNumber: { type: String, unique: true, sparse: true }, // Allow multiple null values
  otp: { type: String },
  verified: { type: Boolean, default: false },
  activeSubscriptions: [
    {
      subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
