const mongoose = require('mongoose');

const desaWisataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    photo: { type: String, required: true },
    description: { type: String, required: true },
    longdesc: { type: String, required: true },
    urlvid: { type: String, required: true },
    reviews: [
        {
            reviewerName: { type: String, required: true },
            reviewContent: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

const DesaWisata = mongoose.model('DesaWisata', desaWisataSchema);

module.exports = DesaWisata;
