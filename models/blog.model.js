const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },  // This will store the rich text content as HTML
  author: { type: String, default: 'Anonymous' },
  premium: { type: Boolean, default: false }, // New field
  coverImage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
