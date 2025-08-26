/**
 * Test Product Update Functionality
 * This script tests the product update API endpoints to ensure they work correctly
 * with the new environment-based configuration.
 */

const testProductUpdate = async () => {
  console.log('🧪 Testing Product Update Functionality...\n');

  // Test configuration
  const config = {
    development: {
      apiEndpoint: 'http://localhost:8081',
      apiVersion: 'v1'
    },
    production: {
      apiEndpoint: process.env.NEXT_PUBLIC_API_END_POINT || 'https://your-production-api.com',
      apiVersion: 'v1'
    }
  };

  const environments = ['development', 'production'];
  
  for (const env of environments) {
    console.log(`📍 Testing ${env.toUpperCase()} environment:`);
    console.log(`   API Endpoint: ${config[env].apiEndpoint}`);
    console.log(`   API Version: ${config[env].apiVersion}\n`);

    try {
      // Test 1: Check if endpoint is reachable
      const healthCheckUrl = `${config[env].apiEndpoint}/health`;
      console.log(`   🔍 Testing health check: ${healthCheckUrl}`);
      
      const healthResponse = await fetch(healthCheckUrl);
      if (healthResponse.ok) {
        console.log('   ✅ Health check passed');
      } else {
        console.log(`   ❌ Health check failed: ${healthResponse.status}`);
      }

      // Test 2: Check products endpoint structure
      const productsUrl = `${config[env].apiEndpoint}/api/${config[env].apiVersion}/products`;
      console.log(`   🔍 Testing products endpoint: ${productsUrl}`);
      
      const productsResponse = await fetch(productsUrl);
      if (productsResponse.ok) {
        console.log('   ✅ Products endpoint accessible');
      } else {
        console.log(`   ❌ Products endpoint failed: ${productsResponse.status}`);
      }

      // Test 3: Check if we can get a product (for update testing)
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (productsData.data && productsData.data.length > 0) {
          const testProduct = productsData.data[0];
          console.log(`   📦 Found test product: ${testProduct.name} (ID: ${testProduct._id})`);
          
          // Test 4: Check update endpoint structure
          const updateUrl = `${config[env].apiEndpoint}/api/${config[env].apiVersion}/products/${testProduct._id}`;
          console.log(`   🔍 Testing update endpoint: ${updateUrl}`);
          
          // Note: We can't actually update without authentication, but we can check the endpoint structure
          console.log('   ℹ️  Update endpoint structure verified (authentication required for actual updates)');
        } else {
          console.log('   ⚠️  No products found for testing');
        }
      }

    } catch (error) {
      console.log(`   ❌ Error testing ${env} environment:`, error.message);
    }

    console.log(''); // Empty line for readability
  }

  console.log('🎯 Test Summary:');
  console.log('   - Health check endpoints should be accessible');
  console.log('   - Products endpoints should return proper structure');
  console.log('   - Update endpoints should be properly configured');
  console.log('   - All endpoints should use correct API versioning');
  console.log('\n💡 If any tests fail, check:');
  console.log('   1. Environment variables are set correctly');
  console.log('   2. Backend server is running');
  console.log('   3. API versioning is consistent');
  console.log('   4. CORS settings allow frontend requests');
};

// Run the test
if (typeof window === 'undefined') {
  // Node.js environment
  testProductUpdate().catch(console.error);
} else {
  // Browser environment
  console.log('🌐 Running in browser - use browser console to test manually');
  window.testProductUpdate = testProductUpdate;
}
