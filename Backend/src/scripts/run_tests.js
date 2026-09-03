const { identifyCadastralParcel } = require('../services/cadastralService');
const { lookupBhoomiOwnerRecord } = require('../integrations/karnataka/bhoomi/bhoomiProvider');
const fs = require('fs');
const path = require('path');

const TEST_LOCATIONS = [
  { name: 'Target Test Record (Survey 54)', lat: 15.393899, lng: 76.834175 },
  { name: 'Doddaballapura (Parcel)', lat: 13.2980, lng: 77.5380 },
  { name: 'Nelamangala (Parcel)', lat: 13.0980, lng: 77.3940 },
  { name: 'Hoskote (Parcel)', lat: 13.0700, lng: 77.7980 },
  { name: 'Chikkaballapura (Parcel)', lat: 13.4350, lng: 77.7280 },
  { name: 'Mandya (Parcel)', lat: 12.5240, lng: 76.8960 },
  { name: 'Tumakuru (Parcel)', lat: 13.3400, lng: 77.1000 },
  { name: 'Yelahanka North (Parcel)', lat: 13.1500, lng: 77.5900 },
  { name: 'Devanahalli (Settlement)', lat: 13.2450, lng: 77.7120 }
];

async function runEmpiricalSuite() {
  console.log('========================================================================');
  console.log('🧪 Running Empirical Test Suite for Karnataka KGIS & Owner Details Lookup');
  console.log('========================================================================\n');

  for (let i = 0; i < TEST_LOCATIONS.length; i++) {
    const loc = TEST_LOCATIONS[i];
    console.log(`[TEST #${i + 1}] Querying ${loc.name} (${loc.lat}, ${loc.lng})...`);
    
    try {
      const res = await identifyCadastralParcel(loc.lat, loc.lng);
      if (res.success && res.count > 0) {
        const p = res.primaryParcel;
        console.log(`   -> Identified Survey: ${p.surveyNumber}, KGISCadastralID: ${p.kgisCadastralId || p.objectID}`);
        
        const ownerRes = await lookupBhoomiOwnerRecord(p);
        console.log(`  ✅ PASS | Survey: ${p.surveyNumber} | Bhoomi Status: ${ownerRes.status} | Records: ${ownerRes.recordCount}`);
      } else {
        console.log(`  ❌ NO PARCEL FOUND | Message: ${res.message}`);
      }
    } catch (e) {
      console.log(`  ❌ ERROR: ${e.message}`);
    }
  }

  console.log('\n====================================================');
  console.log('✅ Test Suite Execution Complete');
  console.log('====================================================');
}

runEmpiricalSuite();
