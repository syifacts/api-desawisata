const mongoose = require('mongoose');

// Schema untuk review
const reviewSchema = new mongoose.Schema({
    reviewerName: { type: String, required: true }, // Nama reviewer
    reviewText: { type: String, required: true },   // Isi ulasan
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating antara 1 dan 5
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Menyimpan userId dari pengulas
}, { timestamps: true });

// Schema untuk desa wisata
const desaWisataSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nama desa wisata
    location: { type: String, required: true }, // Lokasi desa wisata
    photo: { type: String, required: true }, // URL foto desa wisata
    description: { type: String, required: true }, // Deskripsi desa wisata
    longdesc: { type: String, required: true }, // Deskripsi panjang
    urlvid: { type: String, required: true }, // URL video
    reviews: [reviewSchema] // Array of reviews
}, { timestamps: true });

// Model DesaWisata
const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;
