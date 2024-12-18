const mongoose = require('mongoose');
const User = require('./models/User'); // Pastikan Anda memiliki model User untuk validasi username

const reviewSchema = new mongoose.Schema({
    reviewerName: { type: String, required: true }, // Nama reviewer
    reviewText: { type: String, required: true },   // Isi ulasan
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating antara 1 dan 5
}, { timestamps: true });

const desaWisataSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nama desa wisata
    location: { type: String, required: true }, // Lokasi desa wisata
    photo: { type: String, required: true }, // URL foto desa wisata
    description: { type: String, required: true }, // Deskripsi desa wisata
    longdesc: { type: String, required: true }, // Deskripsi panjang
    urlvid: { type: String, required: true }, // URL video
    reviews: [reviewSchema], // Array of reviews
    username: { 
        type: String, 
        required: true,
        validate: {
            validator: async function(value) {
                const user = await User.findOne({ username: value });
                return user !== null; // Memastikan username yang diinputkan sesuai dengan pengguna yang terdaftar
            },
            message: 'Username tidak ditemukan!'
        }
    }
}, { timestamps: true });

const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;
