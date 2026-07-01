const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: String,
  location: String,
  price: Number,
  rating: { type: Number, default: 4.8 },
  images: [String],
  image: String,
  image_url: String,
  photo: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);