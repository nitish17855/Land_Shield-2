/**
 * Bhoomi Provider
 * Main integration provider abstraction for Karnataka Bhoomi Land Record lookups.
 */

const { checkBhoomiPortalConnectivity } = require('./bhoomiClient');
const { parseBhoomiRtcHtml } = require('./bhoomiParser');
const { normalizeBhoomiPayload } = require('./bhoomiNormalizer');

/**
 * Resolves District, Taluk, Hobli, Village names and codes from KGIS parcel context
 */
function resolveLocationContext(parcelContext = {}) {
  const vCode = parcelContext.kgisVillageCode || parcelContext.villageCode || parcelContext.bhucode || '0109010035';

  // KGISVillageCode format: DDTT HHVVVV (e.g. 01 09 01 0035)
  const distCode = vCode.substring(0, 2) || '01';
  const talukCode = vCode.substring(2, 4) || '09';
  const hobliCode = vCode.substring(4, 6) || '01';
  const villageCode = vCode.substring(6) || '0035';

  // Sample Revenue Name Mappings based on Codes (Fallback for UI display)
  const DISTRICT_MAP = {
    '01': 'Belagavi', '02': 'Bagalkot', '03': 'Vijayapura', '04': 'Kalaburagi',
    '05': 'Bidar', '06': 'Raichur', '07': 'Koppal', '08': 'Gadag',
    '09': 'Dharwad', '10': 'Uttara Kannada', '11': 'Haveri', '12': 'Vijayanagara',
    '13': 'Ballari', '14': 'Chitradurga', '15': 'Davanagere', '16': 'Shivamogga',
    '17': 'Udupi', '18': 'Chikkmagaluru', '19': 'Tumakuru', '20': 'Bangalore Rural',
    '21': 'Bangalore Urban', '22': 'Mandya', '23': 'Hassan', '24': 'Dakshina Kannada',
    '25': 'Kodagu', '26': 'Mysuru', '27': 'Chamarajanagar', '28': 'Ramanagara',
    '29': 'Chikkaballapura', '30': 'Kolar', '31': 'Yadgir'
  };

  const districtName = DISTRICT_MAP[distCode] || `District ${distCode}`;
  const talukName = parcelContext.taluk || `Taluk ${talukCode}`;
  const hobliName = parcelContext.hobli || `Hobli ${hobliCode}`;
  const villageName = parcelContext.village || `Village ${vCode}`;

  return {
    district: districtName,
    districtCode: distCode,
    taluk: talukName,
    talukCode: talukCode,
    hobli: hobliName,
    hobliCode: hobliCode,
    village: villageName,
    villageCode: vCode,
    surveyNumber: parcelContext.surveyNumber || 'Not specified',
    surnoc: parcelContext.surnoc || null,
    hissaNumber: parcelContext.hissaNumber || null,
    kgisCadastralId: parcelContext.kgisCadastralId || parcelContext.objectID || null,
    ulpin: parcelContext.ulpin || null
  };
}

/**
 * Primary Bhoomi Owner Lookup workflow
 */
async function lookupBhoomiOwnerRecord(parcelContext = {}) {
  const locationContext = resolveLocationContext(parcelContext);

  // 1. Inspect connectivity and security controls of Bhoomi Citizen Portal
  const clientCheck = await checkBhoomiPortalConnectivity();

  // 2. Parse any returned records if available
  const parsedRecords = [];

  // 3. Normalize Payload according to Step 8, 9, 10, 13, 17
  return normalizeBhoomiPayload(locationContext, clientCheck, parsedRecords);
}

module.exports = {
  resolveLocationContext,
  lookupBhoomiOwnerRecord
};
