const DesaWisata = require('../models/desawisata');

// GET - Semua desa wisata
const getDesaWisata = async (request, h) => {
  try {
    const desaWisata = await DesaWisata.find();
    return h.response(desaWisata).code(200);
  } catch (err) {
    return h.response({ message: 'Error fetching data' }).code(500);
  }
};

// GET - Desa wisata berdasarkan ID
const getDesaWisataById = async (request, h) => {
  const { id } = request.params;
  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }
    return h.response(desaWisata).code(200);
  } catch (err) {
    return h.response({ message: 'Error fetching data' }).code(500);
  }
};

// POST - Menambahkan desa wisata
const postDesaWisata = async (request, h) => {
  const { name, location, photo, description, longdesc, urlvid } = request.payload;
  if (!name || !location || !photo || !description || !longdesc || !urlvid) {
    return h.response({ message: 'Semua field wajib diisi!' }).code(400);
  }

  try {
    const newDesaWisata = new DesaWisata({ name, location, photo, description, longdesc, urlvid });
    await newDesaWisata.save();
    return h.response({ message: 'Data added successfully' }).code(201);
  } catch (err) {
    return h.response({ message: 'Error adding data' }).code(500);
  }
};

// POST - Menambahkan ulasan ke desa wisata
const postReview = async (request, h) => {
  const { id } = request.params;
  const { name, content, rating } = request.payload;

  if (!name || !content || !rating || rating < 1 || rating > 5) {
    return h.response({ message: 'Nama, isi ulasan, dan rating (1-5) wajib diisi!' }).code(400);
  }

  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    desaWisata.reviews.push({ name, content, rating });
    await desaWisata.save();

    return h.response({ message: 'Ulasan berhasil ditambahkan' }).code(201);
  } catch (err) {
    return h.response({ message: 'Error adding review' }).code(500);
  }
};

// GET - Menampilkan semua ulasan desa wisata
const getReviews = async (request, h) => {
  const { id } = request.params;

  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    return h.response(desaWisata.reviews).code(200);
  } catch (err) {
    return h.response({ message: 'Error fetching reviews' }).code(500);
  }
};

// DELETE - Menghapus ulasan berdasarkan ID ulasan
const deleteReview = async (request, h) => {
  const { id, reviewId } = request.params;

  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    const reviewIndex = desaWisata.reviews.findIndex((r) => r._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return h.response({ message: 'Ulasan tidak ditemukan' }).code(404);
    }

    desaWisata.reviews.splice(reviewIndex, 1);
    await desaWisata.save();

    return h.response({ message: 'Ulasan berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ message: 'Error deleting review' }).code(500);
  }
};

module.exports = [
  { method: 'GET', path: '/desawisata', handler: getDesaWisata },
  { method: 'GET', path: '/desawisata/{id}', handler: getDesaWisataById },
  { method: 'POST', path: '/desawisata', handler: postDesaWisata },
  { method: 'POST', path: '/desawisata/{id}/reviews', handler: postReview },
  { method: 'GET', path: '/desawisata/{id}/reviews', handler: getReviews },
  { method: 'DELETE', path: '/desawisata/{id}/reviews/{reviewId}', handler: deleteReview },
];
