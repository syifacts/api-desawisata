const authMiddleware = (request, h) => {
  try {
    const username = request.auth.credentials?.username;

    if (!username) {
      return h.response({ message: 'Unauthorized: Username not found' }).code(401).takeover();
    }

    request.username = username;
    return h.continue;
  } catch (error) {
    return h.response({ message: 'Internal Server Error', error: error.message }).code(500).takeover();
  }
};

module.exports = authMiddleware;
