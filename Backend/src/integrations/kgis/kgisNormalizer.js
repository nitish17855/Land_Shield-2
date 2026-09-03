/**
 * KGIS Cadastral Feature Normalizer
 * Transforms raw ArcGIS / GeoJSON response into a standardized payload.
 */

const { getGeometryExtent } = require('../../utils/geometry');

function normalizeValue(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === '' ? null : str;
}

function normalizeParcelFeature(feature, index = 0) {
  if (!feature) return null;

  const props = feature.properties || feature.attributes || {};
  const geometry = feature.geometry || null;

  // Extract Survey Number
  let surveyNumber = normalizeValue(props.surveynumberi);
  if (!surveyNumber || surveyNumber === '0') {
    surveyNumber = normalizeValue(props.Surveynumber_Old);
  }
  if (!surveyNumber) {
    surveyNumber = normalizeValue(props.Label);
  }

  // Extract Surnoc and Hissa
  const surnoc = normalizeValue(props.Surnoc);
  const hissaNumber = normalizeValue(props.HissaNo);

  // Extract Village Identifiers
  const villageId = normalizeValue(props.KGISVillageID);
  const villageCode = normalizeValue(props.KGISVillageCode);
  const uniqueVillageCode = normalizeValue(props.UniqueVillageCode);
  const bhuCode = normalizeValue(props.bhucode);
  const lgdVillageCode = normalizeValue(props.LGD_VillageCode);

  // Extract Land Attributes
  const category = normalizeValue(props.Category) || 'Unspecified';
  const ulpin = normalizeValue(props.ULPIN);
  const kharab = normalizeValue(props.Kharab);
  const akharbhand = normalizeValue(props.Akharbhand);

  // Extract Area & Perimeter
  const areaSqMtrs = props['SHAPE.STArea()'] || props['st_area(shape)'] || props['Shape_Area'] || null;
  const perimeterMtrs = props['SHAPE.STLength()'] || props['st_length(shape)'] || props['Shape_Length'] || null;

  // Format Area display string (Sq. meters & approximate Acres if available)
  let areaDisplay = 'Not available';
  if (areaSqMtrs && !isNaN(Number(areaSqMtrs))) {
    const sqM = Number(areaSqMtrs);
    const acres = (sqM / 4046.86).toFixed(3);
    areaDisplay = `${sqM.toLocaleString('en-IN', { maximumFractionDigits: 2 })} sq.m (~${acres} Acres)`;
  }

  // Geometry details
  const hasGeometry = Boolean(geometry && geometry.coordinates && geometry.coordinates.length > 0);
  const geometryType = geometry ? geometry.type : 'Unavailable';
  const extent = getGeometryExtent(geometry);

  return {
    candidateId: index + 1,
    objectID: props.OBJECTID || null,
    kgisCadastralId: props.KGISCadastralID || null,

    // Primary Cadastral Identifiers
    surveyNumber: surveyNumber || 'Not available in returned cadastral feature',
    hasSurveyNumber: Boolean(surveyNumber),

    surnoc: surnoc || 'Not available in returned cadastral feature',
    hasSurnoc: Boolean(surnoc),

    hissaNumber: hissaNumber || 'Not available in returned cadastral feature',
    hasHissaNumber: Boolean(hissaNumber),

    // Village & Administrative Identifiers
    villageId: villageId || 'Not available',
    villageCode: villageCode || 'Not available',
    uniqueVillageCode: uniqueVillageCode || 'Not available',
    bhuCode: bhuCode || 'Not available',
    lgdVillageCode: lgdVillageCode || 'Not available',

    // Land Details
    ulpin: ulpin || 'Not available',
    category: category,
    kharab: kharab || 'None',
    akharbhand: akharbhand || 'Not available',
    area: areaDisplay,
    areaSqMtrs: areaSqMtrs ? Number(areaSqMtrs) : null,
    perimeterMtrs: perimeterMtrs ? Number(perimeterMtrs) : null,

    // Geometry Metadata
    geometryStatus: hasGeometry ? 'Available' : 'Unavailable',
    geometryType: geometryType,
    extent: extent,
    geometry: geometry,

    // Raw Attributes for Developer Inspector
    rawAttributes: props
  };
}

module.exports = {
  normalizeParcelFeature
};
