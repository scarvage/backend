const Subscription = require('../models/subscription.model');
const Product = require('../models/product.model');

// Create a subscription
exports.createSubscription = async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add product to subscription
exports.addProductToSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId);
    const product = await Product.findById(req.body.productId);
    if (!subscription || !product) return res.status(404).json({ message: 'Subscription or product not found' });
    if(!subscription || !product)return res.status(404).json({message:'Product not found'})
    subscription.products.push(product._id);
    await subscription.save();
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// xGet all subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('products');
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId).populate({
      path: 'products',
      populate: { path: 'funds' }
    });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.addProductToSubscription = async (req, res) => {
  const { subscriptionId, productId } = req.params;

  try {
    // Check if the subscription exists
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product is already in the subscription
    if (subscription.products.includes(productId)) {
      return res.status(400).json({ message: 'Product is already in this subscription' });
    }

    // Add the product to the subscription
    subscription.products.push(productId);
    await subscription.save();

    res.status(200).json({ message: 'Product added to subscription', subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};