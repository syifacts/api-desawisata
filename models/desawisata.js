const mongoose = require('mongoose');

const desaWisataSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nama desa wisata
    location: { type: String, required: true }, // Lokasi desa wisata
    photo: { type: String, required: true }, // URL foto desa wisata
    description: { type: String, required: true }, // Deskripsi desa wisata
    longdesc: { type: String, required: true }, // Deskripsi panjang
    urlvid: { type: String, required: true }, // URL video
}, { timestamps: true });

const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;

