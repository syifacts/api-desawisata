const jwt = require('jsonwebtoken');

const authenticate = (request, h) => {
  const token = request.headers.authorization;
  if (!token) {
    return h.response({ message: 'Unauthorized' }).code(401);
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Gantilah dengan secret key Anda
    request.auth.credentials = { username: decoded.username }; // Menyimpan username ke request
    return h.continue;
  } catch (err) {
    return h.response({ message: 'Invalid token' }).code(401);
  }
};

module.exports = authenticate;
