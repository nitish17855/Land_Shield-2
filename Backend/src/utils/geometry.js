/**
 * Geometry and Coordinate Utilities for Karnataka Cadastral Explorer
 */

// Approximate Bounding Box for Karnataka State
const KARNATAKA_BOUNDS = {
  minLat: 11.5,
  maxLat: 18.6,
  minLng: 74.0,
  maxLng: 78.6
};

/**
 * Validates latitude and longitude format and range.
 */
function validateCoordinates(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return {
      isValid: false,
      error: 'Invalid coordinates. Latitude and Longitude must be valid numerical values.'
    };
  }

  if (latitude < -90 || latitude > 90) {
    return {
      isValid: false,
      error: `Latitude out of valid range (-90 to 90): ${latitude}`
    };
  }

  if (longitude < -180 || longitude > 180) {
    return {
      isValid: false,
      error: `Longitude out of valid range (-180 to 180): ${longitude}`
    };
  }

  const isInsideKarnataka = (
    latitude >= KARNATAKA_BOUNDS.minLat &&
    latitude <= KARNATAKA_BOUNDS.maxLat &&
    longitude >= KARNATAKA_BOUNDS.minLng &&
    longitude <= KARNATAKA_BOUNDS.maxLng
  );

  return {
    isValid: true,
    latitude,
    longitude,
    isInsideKarnataka,
    warning: !isInsideKarnataka ? 'Coordinates appear to be outside Karnataka boundary.' : null
  };
}

/**
 * Converts WGS84 (EPSG:4326) coordinate to Web Mercator (EPSG:3857)
 */
function wgs84ToWebMercator(lng, lat) {
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x, y };
}

/**
 * Converts Web Mercator (EPSG:3857) coordinate to WGS84 (EPSG:4326)
 */
function webMercatorToWgs84(x, y) {
  const lng = (x * 180) / 20037508.34;
  let lat = (y * 180) / 20037508.34;
  lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
  return { lng, lat };
}

/**
 * Calculates a simple bounding box [minLng, minLat, maxLng, maxLat] from GeoJSON geometry
 */
function getGeometryExtent(geometry) {
  if (!geometry || !geometry.coordinates) return null;

  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  function traverse(coords) {
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else if (Array.isArray(coords)) {
      coords.forEach(traverse);
    }
  }

  traverse(geometry.coordinates);

  if (minLng === Infinity || minLat === Infinity) return null;
  return [minLng, minLat, maxLng, maxLat];
}

module.exports = {
  KARNATAKA_BOUNDS,
  validateCoordinates,
  wgs84ToWebMercator,
  webMercatorToWgs84,
  getGeometryExtent
};
