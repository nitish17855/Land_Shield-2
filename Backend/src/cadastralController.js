const { identifyCadastralParcel } = require('../services/cadastralService');
const { lookupBhoomiOwnerRecord } = require('../integrations/karnataka/bhoomi/bhoomiProvider');

/**
 * Handle Cadastral Identify Request
 * POST /api/cadastral/identify
 */
async function handleIdentifyParcel(req, res) {
  try {
    const { lat, lng } = req.body || {};

    if (lat === undefined || lng === undefined || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates provided. lat and lng must be valid numbers.',
        failureClass: 'INVALID_COORDINATES'
      });
    }

    const numericLat = parseFloat(lat);
    const numericLng = parseFloat(lng);

    const result = await identifyCadastralParcel(numericLat, numericLng);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[ERROR] Controller handleIdentifyParcel failure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process cadastral identification.',
      details: error.message,
      failureClass: 'UNEXPECTED_CONTROLLER_ERROR'
    });
  }
}

/**
 * Handle Owner Details Lookup Request
 * POST /api/cadastral/owner-details
 */
async function handleGetOwnerDetails(req, res) {
  try {
    const parcelContext = req.body || {};

    console.log(`[LOG] Incoming Owner Details Lookup: Survey=${parcelContext.surveyNumber}, KGISCadastralID=${parcelContext.kgisCadastralId || parcelContext.objectID}`);

    // Call BhoomiProvider lookup workflow
    const bhoomiPayload = await lookupBhoomiOwnerRecord(parcelContext);

    return res.status(200).json(bhoomiPayload);
  } catch (error) {
    console.error('[ERROR] Controller handleGetOwnerDetails failure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete Bhoomi owner details lookup.',
      details: error.message,
      failureClass: 'BHOOMI_LOOKUP_ERROR'
    });
  }
}

module.exports = {
  handleIdentifyParcel,
  handleGetOwnerDetails
};
