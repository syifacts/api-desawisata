const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  reviewerName: { type: String, required: true },
  username_review: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true },
}, { timestamps: true });

const desaWisataSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  photo: { type: String, required: true },
  description: { type: String, required: true },
  longdesc: { type: String, required: true },
  urlvid: { type: String, required: true },
  reviews: [reviewSchema],  // Array of review objects
}, { timestamps: true });

const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;
