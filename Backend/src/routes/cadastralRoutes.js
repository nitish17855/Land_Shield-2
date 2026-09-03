/**
 * Cadastral Routes
 */

const express = require('express');
const { handleIdentifyParcel, handleGetOwnerDetails } = require('../controllers/cadastralController');

const router = express.Router();

// POST /api/cadastral/identify
router.post('/identify', handleIdentifyParcel);

// POST /api/cadastral/owner-details
router.post('/owner-details', handleGetOwnerDetails);


// GET /api/cadastral/health
router.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Karnataka Cadastral Explorer API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
