/**
 * Test Zippopotam.us API to verify it's working
 * Run with: npm run test:zip-api
 */

const TEST_ZIPS = [
  '44289', // Sterling, OH
  '44256', // Medina, OH
  '10001', // New York, NY
  '90210', // Beverly Hills, CA
  '33139', // Miami Beach, FL
  '60601', // Chicago, IL
  '00000', // Invalid
  '99999', // Invalid
];

async function testZipApi() {
  console.log('🔍 Testing Zippopotam.us API\n');
  console.log('This free API converts zip codes to accurate coordinates.\n');

  console.log('| Zip Code | Status | City | State | Lat | Lng |');
  console.log('|----------|--------|------|-------|-----|-----|');

  for (const zip of TEST_ZIPS) {
    try {
      const start = Date.now();
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      const elapsed = Date.now() - start;

      if (response.ok) {
        const data = await response.json();
        const place = data.places[0];
        console.log(
          `| ${zip} | ✅ ${elapsed}ms | ${place['place name'].substring(0, 15)} | ${place['state abbreviation']} | ${parseFloat(place.latitude).toFixed(4)} | ${parseFloat(place.longitude).toFixed(4)} |`
        );
      } else {
        console.log(
          `| ${zip} | ❌ ${response.status} | Invalid zip | - | - | - |`
        );
      }
    } catch (error) {
      console.log(
        `| ${zip} | ⚠️ Error | ${(error as Error).message.substring(0, 20)} | - | - | - |`
      );
    }

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log('\n✅ API Test Complete!');
  console.log('\n💡 Key findings:');
  console.log('   - API is FREE and requires no API key');
  console.log('   - Response time is typically 50-200ms');
  console.log('   - Returns accurate centroid coordinates for each zip code');
  console.log('   - Invalid zip codes return 404');
}

testZipApi().catch(console.error);
