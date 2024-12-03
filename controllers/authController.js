const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Import JWT package
const connectToDatabase = require('../config/db');
const OTPModel = require('../models/otpmodel');
const User = require('../models/User'); // Import User model
require('dotenv').config();

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify the transporter setup
transporter.verify((error, success) => {
  if (error) {
    console.log('Error with email transporter:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Function to generate a random 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token
function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Login function to generate and send OTP, and save email in User collection
async function login(req, res) {
  const { email } = req.body;
  const otp = generateOTP(); // Generate a 6-digit OTP

  try {
    const db = await connectToDatabase();

    // Check if the user already exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      // If the user does not exist, create a new user record
      user = new User({
        email, // Save email
        verified: false, // Mark as not verified until OTP is validated
      });
      await user.save();
    }

    // Save the OTP to the OTP collection
    await OTPModel.create({ email, otp, createdAt: new Date() });

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    // Send the OTP via email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).send('Error sending OTP email');
      }
      res.status(200).send('OTP sent to your email');
    });
  } catch (error) {
    console.log('Error in login process:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Verify OTP function
async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const db = await connectToDatabase();
    
    // Find the OTP record in the OTP collection
    const record = await OTPModel.findOne({ email, otp });

    if (record) {
      // OTP is valid, delete the OTP record and mark user as verified
      await OTPModel.deleteOne({ _id: record._id });

      // Find the user and mark as verified
      const user = await User.findOne({ email });
      if (user) {
        user.verified = true;
        await user.save();

        // Generate JWT token for the user
        const token = generateToken(user._id);

        // Return the JWT token to the user
        return res.status(200).json({ message: 'Login successful', token });
      }
    } else {
      return res.status(400).send('Invalid OTP');
    }
  } catch (error) {
    console.log('Error in OTP verification:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { login, verifyOTP };
