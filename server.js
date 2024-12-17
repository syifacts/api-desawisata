const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
require('dotenv').config();
const agrowisataRoutes = require('./routes/routes');

const startMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
  });

  // Register CORS for all routes
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (response.isBoom) {
      Object.assign(response.output.headers, headers);
    } else if (response.headers) {
      Object.assign(response.headers, headers);
    }

    return h.continue;
  });

  // Handle OPTIONS request for CORS preflight
  server.route({
    method: 'OPTIONS',
    path: '/{any*}',
    handler: (request, h) => h.response('CORS preflight response').code(200),
  });

  // Register routes
  server.route(agrowisataRoutes);

  // Start server
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

startMongoDB()
  .then(() => init())
  .catch((err) => {
    console.error('Server initialization error:', err.message);
    process.exit(1);
  });
