const authMiddleware = (request, h) => {
    try {
      // Ambil data username dan userId dari localStorage
      const username = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
  
      // Pastikan username dan userId ada
      if (!username || !userId) {
        return h.response({ message: 'Unauthorized: Username or User ID not found' }).code(401).takeover();
      }
  
      request.auth.credentials = { username, userId }; // Menyimpan ke dalam credentials
      return h.continue;
    } catch (error) {
      return h.response({ message: 'Internal Server Error', error: error.message }).code(500).takeover();
    }
  };
  
  module.exports = authMiddleware;
  