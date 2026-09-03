/**
 * Cadastral Service
 * Handles business logic, feature normalization, candidate selection, caching, and logging.
 */

const { crypto, randomUUID } = require('crypto');
const { queryKGISCadastralPoint } = require('../integrations/kgis/kgisCadastralProvider');
const { normalizeParcelFeature } = require('../integrations/kgis/kgisNormalizer');

// Simple short-term in-memory cache for development testing
const queryCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

function getCacheKey(lat, lng) {
  // Round to 5 decimal places (~1.1 meters resolution)
  return `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;
}

async function identifyCadastralParcel(lat, lng) {
  const requestId = randomUUID ? randomUUID() : `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const timestamp = new Date().toISOString();
  const cacheKey = getCacheKey(lat, lng);

  // Check in-memory cache
  if (queryCache.has(cacheKey)) {
    const cached = queryCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`[LOG] requestId=${requestId} lat=${lat} lng=${lng} status=CACHED results=${cached.data.count} time=0ms`);
      return {
        ...cached.data,
        requestId,
        isCached: true
      };
    } else {
      queryCache.delete(cacheKey);
    }
  }

  // Live KGIS query
  const providerResult = await queryKGISCadastralPoint(lng, lat);

  // Log identification request details
  console.log(
    `[LOG] requestId=${requestId} lat=${lat} lng=${lng} timestamp=${timestamp} status=${providerResult.status} ` +
    `results=${providerResult.features ? providerResult.features.length : 0} time=${providerResult.responseTimeMs}ms ` +
    `${providerResult.errorMessage ? `error="${providerResult.errorMessage}"` : ''}`
  );

  if (providerResult.status === 'ERROR') {
    return {
      success: false,
      requestId,
      queryTimestamp: timestamp,
      failureClass: providerResult.failureClass,
      message: providerResult.errorMessage,
      sourceUrl: providerResult.sourceUrl,
      responseTimeMs: providerResult.responseTimeMs,
      candidates: [],
      count: 0
    };
  }

  const rawFeatures = providerResult.features || [];

  if (rawFeatures.length === 0) {
    return {
      success: true,
      requestId,
      queryTimestamp: timestamp,
      message: 'No cadastral parcel found at this location.',
      sourceUrl: providerResult.sourceUrl,
      responseTimeMs: providerResult.responseTimeMs,
      candidates: [],
      count: 0,
      spatialReference: providerResult.spatialReference,
      rawResponse: providerResult.rawResponse
    };
  }

  // Normalize returned features
  const candidates = rawFeatures.map((feat, idx) => normalizeParcelFeature(feat, idx));

  // Prioritize land parcels if category exists, but keep all candidates available
  // Sort candidate list so 'Parcel' category appears first if multiple returned
  candidates.sort((a, b) => {
    if (a.category === 'Parcel' && b.category !== 'Parcel') return -1;
    if (a.category !== 'Parcel' && b.category === 'Parcel') return 1;
    return 0;
  });

  const resultPayload = {
    success: true,
    requestId,
    queryTimestamp: timestamp,
    sourceUrl: providerResult.sourceUrl,
    responseTimeMs: providerResult.responseTimeMs,
    clickedPoint: { lat: Number(lat), lng: Number(lng) },
    count: candidates.length,
    isMultiple: candidates.length > 1,
    message: candidates.length > 1
      ? 'Multiple cadastral features found at this location.'
      : 'Cadastral parcel identified successfully.',
    candidates,
    primaryParcel: candidates[0],
    spatialReference: providerResult.spatialReference,
    rawResponse: providerResult.rawResponse
  };

  // Cache successful responses
  queryCache.set(cacheKey, { timestamp: Date.now(), data: resultPayload });

  return resultPayload;
}

module.exports = {
  identifyCadastralParcel
};
