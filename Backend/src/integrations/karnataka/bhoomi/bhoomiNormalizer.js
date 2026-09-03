/**
 * Bhoomi Normalizer
 * Transforms Bhoomi lookup findings or manual verification states into normalized schema.
 */

function normalizeBhoomiPayload(locationContext, clientCheck, parsedRecords = []) {
  const retrievedAt = new Date().toISOString();

  const propertyContext = {
    district: locationContext.district || 'Karnataka State',
    districtCode: locationContext.districtCode || 'N/A',
    taluk: locationContext.taluk || 'N/A',
    talukCode: locationContext.talukCode || 'N/A',
    hobli: locationContext.hobli || 'N/A',
    hobliCode: locationContext.hobliCode || 'N/A',
    village: locationContext.village || 'N/A',
    villageCode: locationContext.villageCode || 'N/A',
    surveyNumber: locationContext.surveyNumber || 'Not specified',
    kgisCadastralId: locationContext.kgisCadastralId || null,
    ulpin: locationContext.ulpin || null
  };

  const hasOwnerDetails = parsedRecords.length > 0;
  const isMultiple = parsedRecords.length > 1;

  let status = 'manual_verification_required';
  let message = '';
  let granularity = 'Survey-level record';

  if (hasOwnerDetails) {
    status = 'success';
    granularity = parsedRecords.some(r => r.hissaNumber && r.hissaNumber !== 'Not returned by source')
      ? 'Hissa-level record'
      : 'Survey-level record';
    message = isMultiple
      ? `Multiple subdivision records found for Survey ${propertyContext.surveyNumber}.`
      : `Recorded holder details retrieved for Survey ${propertyContext.surveyNumber}.`;
  } else {
    status = 'manual_verification_required';
    message = `Official Karnataka Bhoomi portal requires CAPTCHA verification for Survey ${propertyContext.surveyNumber}. Use the assisted Bhoomi link or RTC document upload below.`;
  }

  return {
    success: true,
    status,
    propertyContext,
    retrievedAt,
    hasOwnerDetails,
    isMultiple,
    granularity,
    recordCount: parsedRecords.length,
    message,
    sourceAttribution: 'Recorded holder from available land records (Karnataka Bhoomi Land Records Portal)',
    bhoomiPortalUrl: clientCheck?.endpoint || 'https://landrecords.karnataka.gov.in/service53/',
    bhoomiRequestDebug: {
      endpoint: clientCheck?.endpoint || 'https://landrecords.karnataka.gov.in/service53/',
      method: clientCheck?.method || 'GET',
      statusCode: clientCheck?.statusCode || 200,
      responseTimeMs: clientCheck?.responseTimeMs || 0,
      requiresCaptcha: clientCheck?.requiresCaptcha ?? true,
      requiresViewState: clientCheck?.requiresViewState ?? true
    },
    ownershipRecords: parsedRecords
  };
}

module.exports = {
  normalizeBhoomiPayload
};
