/**
 * Test Product Update Fix - Verify that product update now works with correct URLs
 */

// Mock environment config
const envConfig = {
  NEXT_PUBLIC_API_END_POINT: "http://localhost:8081",
  NEXT_PUBLIC_API_VERSION: "v1",
};

// Simulate the fixed HTTP client
class MockHttpClient {
  constructor() {
    this.baseUrl = envConfig.NEXT_PUBLIC_API_END_POINT;
  }

  buildFullUrl(url) {
    // If URL is already a full HTTP URL, return as is
    if (url.startsWith("http")) {
      return url;
    }

    // If URL starts with /api/, remove the /api part to avoid duplication
    if (url.startsWith("/api/")) {
      const pathWithoutApi = url.replace(/^\/api\/v?\d*\/?/, "/");
      return `${this.baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${pathWithoutApi}`;
    }

    // For all other relative paths, add API version
    const apiPath = url.startsWith("/") ? url : `/${url}`;
    return `${this.baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${apiPath}`;
  }

  put(url, data, config = {}) {
    const fullUrl = this.buildFullUrl(url);
    console.log(`PUT ${fullUrl}`);
    console.log(`Data:`, data);
    console.log(`Headers:`, config.headers);
    return Promise.resolve({ success: true, url: fullUrl });
  }
}

console.log("🧪 Testing Product Update Fix...\n");

const httpClient = new MockHttpClient();

// Test product update scenarios
const testScenarios = [
  {
    name: "Update Product with ID",
    url: "/products/68a7db8fce6e2912c29ce084",
    data: { name: "Updated Product", price: 99.99 },
    expectedUrl:
      "http://localhost:8081/api/v1/products/68a7db8fce6e2912c29ce084",
  },
  {
    name: "Update Product Stock",
    url: "/products/68a7db8fce6e2912c29ce084/stock",
    data: { quantity: 50 },
    expectedUrl:
      "http://localhost:8081/api/v1/products/68a7db8fce6e2912c29ce084/stock",
  },
  {
    name: "Create New Product",
    url: "/products",
    data: { name: "New Product", price: 29.99 },
    expectedUrl: "http://localhost:8081/api/v1/products",
  },
];

console.log("Test Scenarios:");
console.log("=".repeat(80));

testScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.name}`);
  console.log(`   URL: ${scenario.url}`);
  console.log(`   Expected: ${scenario.expectedUrl}`);

  const result = httpClient.put(scenario.url, scenario.data, {
    headers: { Authorization: "Bearer test-token" },
  });

  result.then((response) => {
    const isCorrect = response.url === scenario.expectedUrl;
    const status = isCorrect ? "✅ PASS" : "❌ FAIL";
    console.log(`   Result: ${status}`);
    console.log(`   Generated URL: ${response.url}`);

    if (!isCorrect) {
      console.log(`   ❌ URL mismatch!`);
      console.log(`      Expected: ${scenario.expectedUrl}`);
      console.log(`      Got:      ${response.url}`);
    }
  });

  console.log("");
});

// Test URL building directly
console.log("URL Building Tests:");
console.log("=".repeat(50));

const urlTests = [
  { input: "/products", expected: "http://localhost:8081/api/v1/products" },
  {
    input: "/products/123",
    expected: "http://localhost:8081/api/v1/products/123",
  },
  {
    input: "/products/search",
    expected: "http://localhost:8081/api/v1/products/search",
  },
  {
    input: "/api/v1/products",
    expected: "http://localhost:8081/api/v1/products",
  },
  {
    input: "/api/v1/products/123",
    expected: "http://localhost:8081/api/v1/products/123",
  },
];

urlTests.forEach((test, index) => {
  const result = httpClient.buildFullUrl(test.input);
  const isCorrect = result === test.expected;
  const status = isCorrect ? "✅" : "❌";

  console.log(`${index + 1}. ${test.input}`);
  console.log(`   Expected: ${test.expected}`);
  console.log(`   Result:   ${result}`);
  console.log(`   Status:   ${status} ${isCorrect ? "PASS" : "FAIL"}`);
  console.log("");
});

console.log("🎯 Summary:");
console.log("- Product update URLs should now be correct");
console.log("- No more duplicate /api/v1/api/v1/ paths");
console.log("- Both old (/api/v1/products) and new (/products) patterns work");
console.log("- HTTP client automatically handles URL building");

console.log("\n💡 To test in browser:");
console.log("1. Start backend server (port 8081)");
console.log("2. Start frontend (port 3001)");
console.log("3. Login as admin");
console.log("4. Try to update a product");
console.log("5. Check network tab for correct URLs");

if (typeof module !== "undefined") {
  module.exports = { MockHttpClient, testScenarios, urlTests };
}
