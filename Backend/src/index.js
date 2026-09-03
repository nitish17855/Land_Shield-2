/**
 * Karnataka Cadastral Explorer - Express Backend Entry Point
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const cadastralRoutes = require('./routes/cadastralRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/cadastral', cadastralRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Karnataka Cadastral Explorer API',
    description: 'Proof-of-Concept for live KGIS Cadastral Layer 5 spatial identification',
    version: '1.0.0',
    endpoints: {
      identify: 'POST /api/cadastral/identify',
      health: 'GET /api/cadastral/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.url}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Karnataka Cadastral Explorer Backend Running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🗺️ KGIS Target: Layer 5 (Cached_CadastralData_Admin)`);
  console.log(`===================================================`);
});
