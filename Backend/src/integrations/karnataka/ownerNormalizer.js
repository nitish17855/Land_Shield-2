/**
 * Owner Normalizer
 * Safely normalizes raw responses from Karnataka GetCadastral & GetBhoomiData endpoints.
 */

function normalizeValue(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === '' ? null : str;
}

function normalizeOwnerPayload(parcelContext = {}, cadastralResult = {}, bhoomiResult = {}) {
  const retrievedAt = new Date().toISOString();

  const propertyContext = {
    cadastralId: parcelContext.kgisCadastralId || parcelContext.objectID || parcelContext.cadastralId || null,
    surveyNumber: parcelContext.surveyNumber || 'Not available',
    surnoc: parcelContext.surnoc || null,
    hissaNumber: parcelContext.hissaNumber || null,
    villageId: parcelContext.villageId || null,
    villageCode: parcelContext.villageCode || null,
    ulpin: parcelContext.ulpin || null,
    category: parcelContext.category || null
  };

  const rawCadastral = cadastralResult?.rawResponse;
  const rawBhoomi = bhoomiResult?.rawResponse;

  const ownershipRecords = [];

  // Extract from GetCadastral if available
  if (Array.isArray(rawCadastral)) {
    rawCadastral.forEach((item, idx) => {
      if (item && typeof item === 'object') {
        const record = parseOwnerRecord(item, parcelContext, idx);
        if (record) ownershipRecords.push(record);
      }
    });
  } else if (rawCadastral && typeof rawCadastral === 'object' && !rawCadastral.Message && !rawCadastral.error) {
    const record = parseOwnerRecord(rawCadastral, parcelContext, 0);
    if (record) ownershipRecords.push(record);
  }

  // Extract from GetBhoomiData if available
  if (Array.isArray(rawBhoomi)) {
    rawBhoomi.forEach((item, idx) => {
      if (item && typeof item === 'object') {
        const record = parseOwnerRecord(item, parcelContext, ownershipRecords.length + idx);
        if (record) ownershipRecords.push(record);
      }
    });
  } else if (rawBhoomi && typeof rawBhoomi === 'object' && !rawBhoomi.Message && !rawBhoomi.error) {
    const record = parseOwnerRecord(rawBhoomi, parcelContext, ownershipRecords.length);
    if (record) ownershipRecords.push(record);
  }

  const hasOwnerDetails = ownershipRecords.length > 0;
  const isMultiple = ownershipRecords.length > 1;

  let message = 'Recorded holder information retrieved from land-record service.';
  if (!hasOwnerDetails) {
    message = 'Owner information could not be retrieved from the available source.';
  } else if (isMultiple) {
    message = `Multiple subdivision / ownership records found for Survey ${propertyContext.surveyNumber}.`;
  }

  return {
    success: true,
    propertyContext,
    retrievedAt,
    hasOwnerDetails,
    isMultiple,
    recordCount: ownershipRecords.length,
    message,
    sourceAttribution: 'Recorded holder from returned land-record data (Karnataka KGIS / Sujala3 LRI)',
    sourceStatus: {
      getCadastral: {
        statusCode: cadastralResult?.statusCode || 500,
        isSuccess: Boolean(cadastralResult?.isSuccess),
        endpoint: cadastralResult?.endpoint || 'https://mobservice.sujala3lri.karnataka.gov.in/api/GetCadastral',
        responseTimeMs: cadastralResult?.responseTimeMs || 0,
        error: cadastralResult?.error || (cadastralResult?.isSuccess ? null : 'Source returned HTTP 500 or required authorization')
      },
      getBhoomiData: {
        statusCode: bhoomiResult?.statusCode || 500,
        isSuccess: Boolean(bhoomiResult?.isSuccess),
        endpoint: bhoomiResult?.endpoint || 'https://mobservice.sujala3lri.karnataka.gov.in/api/GetBhoomiData',
        responseTimeMs: bhoomiResult?.responseTimeMs || 0,
        error: bhoomiResult?.error || (bhoomiResult?.isSuccess ? null : 'Source returned HTTP 500 or required authorization')
      }
    },
    ownershipRecords,
    rawResponses: {
      getCadastral: cadastralResult || { statusCode: 500, statusText: 'Source unavailable' },
      getBhoomiData: bhoomiResult || { statusCode: 500, statusText: 'Source unavailable' }
    }
  };
}

function parseOwnerRecord(rawObj, parcelContext, index) {
  const ownerName = normalizeValue(
    rawObj.OwnerName || rawObj.ownerName || rawObj.HolderName || rawObj.holder_name || rawObj.Name || rawObj.name
  );

  const surveyNumber = normalizeValue(
    rawObj.SurveyNo || rawObj.surveyno || rawObj.SurveyNumber || parcelContext.surveyNumber
  );

  const surnoc = normalizeValue(
    rawObj.Surnoc || rawObj.surnoc || parcelContext.surnoc
  );

  const hissa = normalizeValue(
    rawObj.HissaNo || rawObj.hissano || rawObj.Hissa || parcelContext.hissaNumber
  );

  const extent = normalizeValue(
    rawObj.Extent || rawObj.extent || rawObj.Area || rawObj.area
  );

  const classification = normalizeValue(
    rawObj.LandClassification || rawObj.classification || rawObj.Category || parcelContext.category
  );

  const recordDate = normalizeValue(
    rawObj.RecordDate || rawObj.date || rawObj.created_date
  );

  const mutationRef = normalizeValue(
    rawObj.MutationNo || rawObj.mutation_no || rawObj.MutationRef
  );

  const rtcRef = normalizeValue(
    rawObj.RTCRef || rawObj.rtc_no || rawObj.BhoomiRef
  );

  if (!ownerName && !extent && !mutationRef && !rtcRef) {
    return null;
  }

  return {
    recordId: index + 1,
    ownerName: ownerName || 'Not returned by source',
    ownerType: normalizeValue(rawObj.OwnerType || rawObj.owner_type) || 'Recorded Holder',
    surveyNumber: surveyNumber || 'Not returned by source',
    surnoc: surnoc || 'Not returned by source',
    hissaNumber: hissa || 'Not returned by source',
    extent: extent || 'Not returned by source',
    classification: classification || 'Not returned by source',
    recordDate: recordDate || 'Not returned by source',
    mutationRef: mutationRef || 'Not returned by source',
    bhoomiRef: rtcRef || 'Not returned by source',
    rawRecord: rawObj
  };
}

module.exports = {
  normalizeOwnerPayload
};
