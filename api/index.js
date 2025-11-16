// Vercel Serverless Function - Wrapper para Express Backend
const path = require('path');

// Importar el servidor Express compilado
const app = require('../backend/dist/server.js').default || require('../backend/dist/server.js');

// Exportar para Vercel
module.exports = app;
