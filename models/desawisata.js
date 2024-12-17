const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Nama user yang mengirim ulasan
    review: { type: String, required: true }, // Isi ulasan
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    }, // Rating antara 1 sampai 5
    createdAt: { type: Date, default: Date.now }, // Waktu ulasan dibuat
});

const desaWisataSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nama desa wisata
    location: { type: String, required: true }, // Lokasi desa wisata
    photo: { type: String, required: true }, // URL foto desa wisata
    description: { type: String, required: true }, // Deskripsi desa wisata
    longdesc: { type: String, required: true }, // Deskripsi panjang
    urlvid: { type: String, required: true }, // URL video
    reviews: [reviewSchema], // Array review
}, { timestamps: true });

const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;
