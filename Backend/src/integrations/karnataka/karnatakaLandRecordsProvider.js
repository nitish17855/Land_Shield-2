/**
 * Karnataka Land Records & Sujala3 LRI Provider
 * Integrates directly with official Karnataka LRI & Bhoomi endpoints.
 */

const SUJALA_GET_CADASTRAL_URL = 'https://mobservice.sujala3lri.karnataka.gov.in/api/GetCadastral';
const SUJALA_GET_BHOOMI_URL = 'https://mobservice.sujala3lri.karnataka.gov.in/api/GetBhoomiData';

/**
 * Fetches Cadastral Record from Sujala3 LRI API by ID
 */
async function fetchGetCadastral(cadastralId) {
  const startTime = Date.now();
  const url = `${SUJALA_GET_CADASTRAL_URL}?ID=${encodeURIComponent(cadastralId)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KarnatakaCadastralExplorer/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const responseTimeMs = Date.now() - startTime;
    const text = await response.text();

    let json = null;
    try { json = JSON.parse(text); } catch (e) { json = text; }

    return {
      endpoint: url,
      method: 'GET',
      statusCode: response.status,
      statusText: response.statusText,
      responseTimeMs,
      timestamp: new Date().toISOString(),
      rawResponse: json,
      isSuccess: response.ok && !json?.Message?.includes('error')
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      endpoint: url,
      method: 'GET',
      statusCode: error.name === 'AbortError' ? 408 : 503,
      statusText: error.name === 'AbortError' ? 'Timeout' : 'Network Error',
      responseTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      error: error.message,
      rawResponse: { error: error.message },
      isSuccess: false
    };
  }
}

/**
 * Fetches Bhoomi Data from Sujala3 LRI API by cadastraliId
 */
async function fetchGetBhoomiData(cadastralId) {
  const startTime = Date.now();
  const url = `${SUJALA_GET_BHOOMI_URL}?cadastraliId=${encodeURIComponent(cadastralId)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KarnatakaCadastralExplorer/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const text = await response.text();

    let json = null;
    try { json = JSON.parse(text); } catch (e) { json = text; }

    return {
      endpoint: url,
      method: 'GET',
      statusCode: response.status,
      statusText: response.statusText,
      responseTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      rawResponse: json,
      isSuccess: response.ok && !json?.Message?.includes('error')
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      endpoint: url,
      method: 'GET',
      statusCode: error.name === 'AbortError' ? 408 : 503,
      statusText: error.name === 'AbortError' ? 'Timeout' : 'Network Error',
      responseTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      error: error.message,
      rawResponse: { error: error.message },
      isSuccess: false
    };
  }
}

/**
 * Orchestrates owner land-record lookup for a selected parcel
 */
async function lookupOwnerDetails(parcelContext) {
  const cadastralId = parcelContext.kgisCadastralId || parcelContext.objectID || parcelContext.cadastralId;

  const [cadastralResult, bhoomiResult] = await Promise.all([
    cadastralId ? fetchGetCadastral(cadastralId) : Promise.resolve({ statusCode: 400, error: 'Cadastral ID unavailable' }),
    cadastralId ? fetchGetBhoomiData(cadastralId) : Promise.resolve({ statusCode: 400, error: 'Cadastral ID unavailable' })
  ]);

  return {
    cadastralId,
    cadastralResult,
    bhoomiResult
  };
}

module.exports = {
  fetchGetCadastral,
  fetchGetBhoomiData,
  lookupOwnerDetails
};
