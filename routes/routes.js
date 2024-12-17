const DesaWisata = require('../models/desawisata');
const authMiddleware = require('../middleware/authmiddleware');

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

// PUT - Mengupdate data desa wisata berdasarkan ID
const putDesaWisata = async (request, h) => {
  const { id } = request.params;
  const { name, location, photo, description, longdesc, urlvid } = request.payload;

  if (!name || !location || !photo || !description || !longdesc || !urlvid) {
    return h.response({ message: 'Semua field wajib diisi!' }).code(400);
  }

  try {
    const updatedDesaWisata = await DesaWisata.findByIdAndUpdate(
      id,
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

// POST - Menambahkan ulasan ke desa wisata
const postReview = async (request, h) => {
  const { id } = request.params;
  const { review, rating } = request.payload;
  const username = request.auth.credentials.username; // Ambil username dari sesi pengguna

  if (!review || !rating) {
    return h.response({ message: 'Review dan rating wajib diisi!' }).code(400);
  }

  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    desaWisata.reviews.push({ username, review, rating });
    await desaWisata.save();

    return h.response({ message: 'Review added successfully', reviews: desaWisata.reviews }).code(201);
  } catch (err) {
    return h.response({ message: 'Error adding review', error: err.message }).code(500);
  }
};

// DELETE - Menghapus ulasan berdasarkan reviewId
const deleteReview = async (request, h) => {
  const { id, reviewId } = request.params;

  try {
    const desaWisata = await DesaWisata.findById(id);
    if (!desaWisata) {
      return h.response({ message: 'Desa Wisata not found' }).code(404);
    }

    desaWisata.reviews = desaWisata.reviews.filter((review) => review._id.toString() !== reviewId);
    await desaWisata.save();

    return h.response({ message: 'Review deleted successfully', reviews: desaWisata.reviews }).code(200);
  } catch (err) {
    return h.response({ message: 'Error deleting review', error: err.message }).code(500);
  }
};

module.exports = [
  { method: 'GET', path: '/desawisata', handler: getDesaWisata },
  { method: 'GET', path: '/desawisata/{id}', handler: getDesaWisataById },
  { method: 'POST', path: '/desawisata', handler: postDesaWisata },
  { method: 'PUT', path: '/desawisata/{id}', handler: putDesaWisata },
  { method: 'DELETE', path: '/desawisata/{id}', handler: deleteDesaWisata },
  { method: 'GET', path: '/desawisata/{id}/reviews', handler: getReviews },
  { method: 'POST', path: '/desawisata/{id}/reviews', handler: postReview, options: { pre: [authMiddleware] } },
  { method: 'DELETE', path: '/desawisata/{id}/reviews/{reviewId}', handler: deleteReview,options: { pre: [authMiddleware] } },
];
