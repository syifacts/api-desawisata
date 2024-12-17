const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
require('dotenv').config();
const agrowisataRoutes = require('./routes/routes');

const startMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
    });

    // Register CORS middleware
    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        // Menangani preflight request (OPTIONS)
        if (request.method === 'options') {
            return h.response().code(204); // Status OK tanpa body untuk preflight
        }

        // Set header CORS
        if (response.isBoom) {
            response.output.headers['Access-Control-Allow-Origin'] = '*';
            response.output.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            response.output.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        } else {
            response.headers['Access-Control-Allow-Origin'] = '*';
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        }

        return h.continue;
    });

    // Register routes
    server.route(agrowisataRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

startMongoDB().then(() => {
    init().catch(err => {
        console.error('Server initialization error:', err);
        process.exit(1);
    });
});
