const mongoose = require('mongoose');

const desaWisataSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nama desa wisata
    location: { type: String, required: true }, // Lokasi desa wisata
    photo: { type: String, required: true }, // URL foto desa wisata
    description: { type: String, required: true }, // Deskripsi desa wisata
    longdesc: { type: String, required: true }, // Deskripsi panjang
    urlvid: { type: String, required: true }, // URL video
    reviews: [ // Array ulasan
        {
            reviewText: { type: String, required: true }, // Teks ulasan
            rating: { type: Number, min: 1, max: 5, required: true }, // Rating ulasan (1-5)
            createdAt: { type: Date, default: Date.now } // Waktu ulasan ditambahkan
        }
    ]
}, { timestamps: true });

const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;
