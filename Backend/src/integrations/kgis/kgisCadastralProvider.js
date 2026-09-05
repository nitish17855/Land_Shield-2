/**
 * KGIS Cadastral Data Provider
 * Direct REST integration with Karnataka KGIS Cadastral Layer 5.
 */

const KGIS_CADASTRAL_LAYER_5_QUERY_URL =
  'https://kgis.ksrsac.in/kgismaps1/rest/services/CadastralData_Admin/Cached_CadastralData_Admin/MapServer/5/query';

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  timeout: 15000
});

function fetchGovJson(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        agent: httpsAgent,
        headers: {
          'Accept': 'application/json, application/geo+json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://kgis.ksrsac.in/',
          'Origin': 'https://kgis.ksrsac.in'
        },
        timeout: timeoutMs
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`KGIS HTTP Error: Status ${res.statusCode} ${res.statusMessage || ''}`));
          }
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Failed to parse KGIS JSON: ${e.message}`));
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('KGIS query timed out after 15 seconds.'));
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Queries KGIS Cadastral Layer 5 at the given point coordinates.
 */
async function queryKGISCadastralPoint(longitude, latitude) {
  const startTime = Date.now();

  const pointGeometry = {
    x: longitude,
    y: latitude,
    spatialReference: { wkid: 4326 }
  };

  const queryParams = new URLSearchParams({
    geometry: JSON.stringify(pointGeometry),
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: 'true',
    outSR: '4326',
    f: 'geojson'
  });

  const fullUrl = `${KGIS_CADASTRAL_LAYER_5_QUERY_URL}?${queryParams.toString()}`;

  try {
    const data = await fetchGovJson(fullUrl, 15000);
    const responseTimeMs = Date.now() - startTime;

    // Handle ArcGIS Error object in JSON response
    if (data.error) {
      throw new Error(`KGIS Service Error ${data.error.code}: ${data.error.message || 'Unknown service error'}`);
    }

    return {
      status: 'SUCCESS',
      statusCode: 200,
      responseTimeMs,
      sourceUrl: fullUrl,
      queryTimestamp: new Date().toISOString(),
      spatialReference: { inSR: 4326, outSR: 4326 },
      rawResponse: data,
      features: data.features || []
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;

    let failureClass = 'KGIS_QUERY_ERROR';
    let errorMessage = error.message;

    if (error.message.includes('timed out')) {
      failureClass = 'KGIS_TIMEOUT';
      errorMessage = 'Karnataka KGIS service query timed out after 15 seconds.';
    } else if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      failureClass = 'KGIS_UNAVAILABLE';
      errorMessage = `Karnataka cadastral service error: ${error.message}`;
    }

    return {
      status: 'ERROR',
      failureClass,
      errorMessage,
      responseTimeMs,
      sourceUrl: fullUrl,
      queryTimestamp: new Date().toISOString(),
      rawResponse: null,
      features: []
    };
  }
}

module.exports = {
  KGIS_CADASTRAL_LAYER_5_QUERY_URL,
  queryKGISCadastralPoint
};
