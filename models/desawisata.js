const mongoose = require('mongoose');

const desaWisataSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  longdesc: String,
  photo: String,
  urlvid: String,
  reviews: [
    {
      reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID pengguna
      reviewerName: { type: String, required: true }, // Nama pemberi ulasan
      reviewText: { type: String, required: true }, // Teks ulasan
      rating: { type: Number, min: 1, max: 5, required: true }, // Rating ulasan
      createdAt: { type: Date, default: Date.now } // Waktu ulasan dibuat
    }
  ]
});

const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;
