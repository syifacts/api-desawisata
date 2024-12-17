const DesaWisata = require('../models/desawisata');

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

  // Validasi input
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

// PUT - Mengupdate data desa wisata berdasarkan ID
const putDesaWisata = async (request, h) => {
  const { id } = request.params;
  const { name, location, photo, description, longdesc, urlvid } = request.payload;

  // Validasi input
  if (!name || !location || !photo || !description || !longdesc || !urlvid) {
    return h.response({ message: 'Semua field wajib diisi!' }).code(400);
  }

  try {
    const updatedDesaWisata = await DesaWisata.findByIdAndUpdate(id, 
      { name, location, photo, description, longdesc, urlvid }, 
      { new: true }
    );
    if (!updatedDesaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }
    return h.response(updatedDesaWisata).code(200);
  } catch (err) {
    return h.response({ message: 'Error updating data', error: err.message }).code(500);
  }
};

// DELETE - Menghapus data desa wisata berdasarkan ID
const deleteDesaWisata = async (request, h) => {
  const { id } = request.params;
  try {
    const deletedDesaWisata = await DesaWisata.findByIdAndDelete(id);
    if (!deletedDesaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }
    return h.response({ message: 'Data deleted successfully' }).code(200);
  } catch (err) {
    return h.response({ message: 'Error deleting data', error: err.message }).code(500);
  }
};

// POST - Menambahkan ulasan pada desa wisata
const postReview = async (request, h) => {
  const { id } = request.params;
  const { reviewerName, reviewText, rating, userId } = request.payload;

  // Validasi input
  if (!reviewerName || !reviewText || !rating || rating < 1 || rating > 5 || !userId) {
    return h.response({ message: 'Field ulasan tidak lengkap atau rating tidak valid!' }).code(400);
  }

  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    // Menambahkan ulasan ke array reviews dengan userId
    desaWisata.reviews.push({ reviewerName, reviewText, rating, userId });
    await desaWisata.save();

    return h.response({ message: 'Review added successfully' }).code(201);
  } catch (err) {
    return h.response({ message: 'Error adding review', error: err.message }).code(500);
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

// DELETE - Menghapus ulasan berdasarkan ID desa wisata dan ID ulasan
const deleteReview = async (request, h) => {
  const { id, reviewId, userId } = request.params;
  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    const review = desaWisata.reviews.find(review => review._id.toString() === reviewId);
    if (!review) {
      return h.response({ message: 'Review not found' }).code(404);
    }

    // Hanya mengizinkan penghapusan jika userId milik review sesuai dengan user yang ingin menghapus
    if (review.userId.toString() !== userId) {
      return h.response({ message: 'Unauthorized' }).code(403);
    }

    // Menghapus review dari array
    const reviewIndex = desaWisata.reviews.findIndex(review => review._id.toString() === reviewId);
    desaWisata.reviews.splice(reviewIndex, 1); // Menghapus review
    await desaWisata.save();

    return h.response({ message: 'Review deleted successfully' }).code(200);
  } catch (err) {
    return h.response({ message: 'Error deleting review', error: err.message }).code(500);
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
    method: 'PUT',
    path: '/desawisata/{id}',
    handler: putDesaWisata,
  },
  {
    method: 'DELETE',
    path: '/desawisata/{id}',
    handler: deleteDesaWisata,
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
    path: '/desawisata/{id}/review/{reviewId}/{userId}',
    handler: deleteReview,
  },
];
