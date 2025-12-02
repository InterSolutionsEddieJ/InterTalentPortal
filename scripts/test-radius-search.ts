/**
 * Test the Optimized Radius Search Approaches
 *
 * Compares:
 * 1. Original approach: getZipCodesWithinRadius (external API - currently returns null)
 * 2. Azure SQL spatial: getZipCodesWithinRadiusAzure (uses GeoLocation column)
 * 3. Direct spatial query: Get profile IDs directly (fastest)
 *
 * Run with: npm run test:radius-search
 */

import { getZipCodesWithinRadius } from '../src/lib/geospatial';
import {
  getZipCodesWithinRadiusAzure,
  getProfileIdsWithinRadiusAzure,
  hasGeoLocationData,
} from '../src/lib/azure-spatial';

const TEST_ZIP = '44289'; // Sterling, OH
const TEST_RADIUS = 25; // 25 miles
const TABLE_NAME = 'RayTestShowcase';

async function testRadiusSearch() {
  console.log('🔍 Testing Radius Search Approaches\n');
  console.log(`Test Parameters:`);
  console.log(`  Center Zip: ${TEST_ZIP}`);
  console.log(`  Radius: ${TEST_RADIUS} miles`);
  console.log(`  Table: ${TABLE_NAME}`);
  console.log('');
  console.log('='.repeat(60));

  // Check if table has GeoLocation data
  console.log('\n📊 Checking GeoLocation Data...\n');
  const hasGeo = await hasGeoLocationData(TABLE_NAME);
  console.log(`  Has GeoLocation data: ${hasGeo ? '✅ YES' : '❌ NO'}`);

  if (!hasGeo) {
    console.log('\n⚠️ No GeoLocation data found!');
    console.log('   Run: npm run import:ray-test-accurate');
    console.log(
      '   This will populate the GeoLocation column with accurate coordinates.'
    );
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));

  // ═══════════════════════════════════════════════════════════════
  // TEST 1: Original approach (external API)
  // ═══════════════════════════════════════════════════════════════
  console.log('\n🔴 TEST 1: Original getZipCodesWithinRadius (External API)\n');
  console.log('   This uses ZipCodeAPI or similar to get zip codes in radius.');
  console.log('   Currently returns NULL because no API is configured.\n');

  const start1 = Date.now();
  const result1 = await getZipCodesWithinRadius(TEST_ZIP, TEST_RADIUS);
  const time1 = Date.now() - start1;

  if (result1) {
    console.log(`   ✅ Result: ${result1.length} zip codes found`);
    console.log(`   Sample: ${result1.slice(0, 5).join(', ')}...`);
  } else {
    console.log(`   ❌ Result: NULL (API not configured - this is expected)`);
    console.log(`   → Falls back to slow per-profile geocoding!`);
  }
  console.log(`   ⏱️ Time: ${time1}ms`);

  console.log('\n' + '='.repeat(60));

  // ═══════════════════════════════════════════════════════════════
  // TEST 2: Azure SQL spatial query for zip codes
  // ═══════════════════════════════════════════════════════════════
  console.log('\n🟢 TEST 2: Azure SQL getZipCodesWithinRadiusAzure\n');
  console.log('   Uses Azure SQL GEOGRAPHY column with spatial index.');
  console.log('   This is your OPTIMIZED approach using Azure SQL!\n');

  const start2 = Date.now();
  const result2 = await getZipCodesWithinRadiusAzure(
    TEST_ZIP,
    TEST_RADIUS,
    TABLE_NAME
  );
  const time2 = Date.now() - start2;

  if (result2) {
    console.log(`   ✅ Result: ${result2.length} zip codes found`);
    console.log(
      `   Sample: ${result2.slice(0, 10).join(', ')}${result2.length > 10 ? '...' : ''}`
    );
  } else {
    console.log(`   ❌ Result: NULL (spatial query failed)`);
  }
  console.log(`   ⏱️ Time: ${time2}ms`);

  console.log('\n' + '='.repeat(60));

  // ═══════════════════════════════════════════════════════════════
  // TEST 3: Azure SQL direct profile IDs (even faster!)
  // ═══════════════════════════════════════════════════════════════
  console.log('\n🟢 TEST 3: Azure SQL getProfileIdsWithinRadiusAzure\n');
  console.log('   Gets profile IDs directly - skips the zip code step!\n');

  const start3 = Date.now();
  const result3 = await getProfileIdsWithinRadiusAzure(
    TEST_ZIP,
    TEST_RADIUS,
    TABLE_NAME
  );
  const time3 = Date.now() - start3;

  if (result3) {
    console.log(`   ✅ Result: ${result3.length} profiles found`);
    console.log(
      `   Sample IDs: ${result3.slice(0, 5).join(', ')}${result3.length > 5 ? '...' : ''}`
    );
  } else {
    console.log(`   ❌ Result: NULL (spatial query failed)`);
  }
  console.log(`   ⏱️ Time: ${time3}ms`);

  console.log('\n' + '='.repeat(60));

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════
  console.log('\n📈 SUMMARY\n');
  console.log('   | Approach | Result | Time | Status |');
  console.log('   |----------|--------|------|--------|');
  console.log(
    `   | Original (External API) | ${result1 ? result1.length + ' zips' : 'NULL'} | ${time1}ms | ${result1 ? '✅' : '❌ Fallback needed'} |`
  );
  console.log(
    `   | Azure SQL (Zip Codes) | ${result2 ? result2.length + ' zips' : 'NULL'} | ${time2}ms | ${result2 ? '✅' : '❌'} |`
  );
  console.log(
    `   | Azure SQL (Profile IDs) | ${result3 ? result3.length + ' profiles' : 'NULL'} | ${time3}ms | ${result3 ? '✅ BEST' : '❌'} |`
  );

  console.log('\n💡 Recommendation:');
  if (result2 && result3) {
    console.log('   ✅ Azure SQL spatial queries work!');
    console.log(
      '   → Use getZipCodesWithinRadiusAzure for your optimized approach'
    );
    console.log(
      '   → Or use getProfileIdsWithinRadiusAzure for direct profile filtering'
    );
    console.log(
      '   → Both leverage the spatial index for O(log n) performance'
    );
  } else {
    console.log('   ⚠️ Azure SQL spatial queries failed');
    console.log('   → Make sure RayTestShowcase table has GeoLocation data');
    console.log('   → Run: npm run import:ray-test-accurate');
  }

  console.log('\n✅ Test complete!');
}

testRadiusSearch().catch(console.error);
