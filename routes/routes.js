const DesaWisata = require('../models/desawisata');
const User = require('../models/user'); // Mengimpor model User

// GET - Mengambil semua data desa wisata
const getDesaWisata = async (request, h) => {
  try {
    const desaWisata = await DesaWisata.find();
    return h.response(desaWisata).code(200);
  } catch (err) {
    return h.response({ message: 'Error fetching data' }).code(500);
  }
};

// GET - Mengambil data desa wisata berdasarkan ID
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

// POST - Menambahkan data desa wisata
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
    return h.response({ message: 'Error adding data', error: err.message }).code(500);
  }
};

// POST - Menambahkan ulasan pada desa wisata
const postReview = async (request, h) => {
  const { id } = request.params;
  const { reviewerName, reviewText, rating, userId } = request.payload; // Memastikan userId ditambahkan

  if (!reviewerName || !reviewText || !rating || rating < 1 || rating > 5 || !userId) {
    return h.response({ message: 'Field ulasan tidak lengkap atau rating tidak valid!' }).code(400);
  }

  try {
    // Validasi apakah userId valid dengan mencari di User model
    const user = await User.findById(userId);
    if (!user) {
      return h.response({ message: 'User not found' }).code(404);
    }

    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    // Menambahkan ulasan ke array reviews
    desaWisata.reviews.push({ reviewerName, reviewText, rating, userId });
    await desaWisata.save();

    return h.response({ message: 'Review added successfully' }).code(201);
  } catch (err) {
    return h.response({ message: 'Error adding review', error: err.message }).code(500);
  }
};

// DELETE - Menghapus ulasan berdasarkan ID desa wisata dan ID ulasan
const deleteReview = async (request, h) => {
  const { id, reviewId } = request.params;
  const { userId } = request.payload; // Menggunakan userId untuk validasi

  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    const review = desaWisata.reviews.id(reviewId);
    if (!review) {
      return h.response({ message: 'Review not found' }).code(404);
    }

    // Validasi apakah userId yang menghapus adalah pemilik review
    if (review.userId.toString() !== userId) {
      return h.response({ message: 'You are not authorized to delete this review' }).code(403);
    }

    review.remove();
    await desaWisata.save();

    return h.response({ message: 'Review deleted successfully' }).code(200);
  } catch (err) {
    return h.response({ message: 'Error deleting review', error: err.message }).code(500);
  }
};

// GET - Mengambil semua ulasan untuk desa wisata berdasarkan ID
const getReviews = async (request, h) => {
  const { id } = request.params;
  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }
    return h.response(desaWisata.reviews).code(200);
  } catch (err) {
    return h.response({ message: 'Error fetching reviews', error: err.message }).code(500);
  }
};

module.exports = [
  {
    method: 'GET',
    path: '/desawisata',
    handler: getDesaWisata,
  },
  {
    method: 'GET',
    path: '/desawisata/{id}',
    handler: getDesaWisataById,
  },
  {
    method: 'POST',
    path: '/desawisata',
    handler: postDesaWisata,
  },
  {
    method: 'POST',
    path: '/desawisata/{id}/review',
    handler: postReview,
  },
  {
    method: 'GET',
    path: '/desawisata/{id}/reviews',
    handler: getReviews,
  },
  {
    method: 'DELETE',
    path: '/desawisata/{id}/review/{reviewId}',
    handler: deleteReview,
  },
];
