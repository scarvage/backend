const User = require('../models/User');
const Subscription = require('../models/subscription.model');

// Endpoint to add a subscription to a user upon payment
exports.addSubscriptionToUser = async (req, res) => {
  const { userId, subscriptionId } = req.body;

  try {
    const user = await User.findById(userId);
    const subscription = await Subscription.findById(subscriptionId);

    if (!user || !subscription) {
      return res.status(404).json({ message: 'User or Subscription not found' });
    }

    // Calculate end date for a 1-month subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + 1);

    // Add the subscription to activeSubscriptions
    user.activeSubscriptions.push({
      subscriptionId: subscription._id,
      startDate,
      endDate
    });

    await user.save();

    return res.status(200).json({
      message: 'Subscription added successfully',
      activeSubscriptions: user.activeSubscriptions
    });
  } catch (error) {
    console.error('Error adding subscription to user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
