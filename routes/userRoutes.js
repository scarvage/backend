// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');
const userController = require('../controllers/user.controller');

// Route to add a subscription to a user
router.post('/addSubscription', userController.addSubscriptionToUser);
// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return res.status(401).json({ message: 'Unauthorized: No email provided' });
  }
  next();
};

// Update profile route
router.put('/profile', authenticate, async (req, res) => {
  const { email, name, dob, panNo, mobileNumber } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile fields
    user.name = name || user.name;
    user.dob = dob || user.dob;
    user.panNo = panNo || user.panNo;
    user.mobileNumber = mobileNumber || user.mobileNumber;

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post('/getprofile', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (user) {
      res.status(200).json({
        id:user._id,
        email: user.email,
        name: user.name,
        dob: user.dob,
        panNo: user.panNo,
        mobileNumber: user.mobileNumber,
        activeSubscriptions:user.activeSubscriptions
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
