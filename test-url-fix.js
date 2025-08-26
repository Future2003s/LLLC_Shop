/**
 * Test URL Building Fix - Verify no more duplicate /api/v1/api/v1/
 */

// Mock environment config
const envConfig = {
  NEXT_PUBLIC_API_END_POINT: "http://localhost:8081",
  NEXT_PUBLIC_API_VERSION: "v1",
};

// Simulate the FIXED HTTP client
class FixedHttpClient {
  constructor() {
    this.baseUrl = envConfig.NEXT_PUBLIC_API_END_POINT;
  }

  buildFullUrl(url) {
    // Check if baseUrl already contains API version to avoid duplication
    const baseUrlHasApiVersion = this.baseUrl.includes(
      `/api/${envConfig.NEXT_PUBLIC_API_VERSION}`
    );

    // If URL starts with /api/, remove the /api part to avoid duplication
    if (url.startsWith("/api/")) {
      const pathWithoutApi = url.replace(/^\/api\/v?\d*\/?/, "/");

      if (baseUrlHasApiVersion) {
        // Base URL already has API version, just append the path
        return `${this.baseUrl}${pathWithoutApi}`;
      } else {
        // Base URL doesn't have API version, add it
        return `${this.baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${pathWithoutApi}`;
      }
    }

    // For all other relative paths
    const apiPath = url.startsWith("/") ? url : `/${url}`;

    if (baseUrlHasApiVersion) {
      // Base URL already has API version, just append the path
      return `${this.baseUrl}${apiPath}`;
    } else {
      // Base URL doesn't have API version, add it
      return `${this.baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${apiPath}`;
    }
  }

  put(url, data, config = {}) {
    const fullUrl = this.buildFullUrl(url);
    console.log(`PUT ${fullUrl}`);
    console.log(`Data:`, data);
    return Promise.resolve({ success: true, url: fullUrl });
  }
}

console.log("🧪 Testing URL Building Fix...\n");

const httpClient = new FixedHttpClient();

// Test the EXACT failing case
const failingCase = {
  name: "Update Product - Previously Failing Case",
  url: "/products/68a7db8fce6e2912c29ce084",
  expectedUrl: "http://localhost:8081/api/v1/products/68a7db8fce6e2912c29ce084",
};

console.log("🎯 Testing Failing Case:");
console.log(`   Input: ${failingCase.url}`);
console.log(`   Expected: ${failingCase.expectedUrl}`);

const result = httpClient.put(failingCase.url, { name: "Test Product" });

result.then((response) => {
  const actualUrl = response.url;
  const isCorrect = actualUrl === failingCase.expectedUrl;
  const hasDuplicate = actualUrl.includes("/api/v1/api/v1/");

  console.log(`\n📊 Results:`);
  console.log(`   Actual URL: ${actualUrl}`);
  console.log(`   Expected:   ${failingCase.expectedUrl}`);
  console.log(`   Correct:    ${isCorrect ? "✅ YES" : "❌ NO"}`);
  console.log(`   Duplicate:  ${hasDuplicate ? "❌ YES" : "✅ NO"}`);

  if (hasDuplicate) {
    console.log(`   🚨 STILL HAS DUPLICATE!`);
  } else {
    console.log(`   🎉 DUPLICATE FIXED!`);
  }
});

// Test all URL patterns
console.log("\n" + "=".repeat(80));
console.log("🧪 Testing All URL Patterns:\n");

const testCases = [
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
  { input: "/api/products", expected: "http://localhost:8081/api/v1/products" },
  {
    input: "/api/products/123",
    expected: "http://localhost:8081/api/v1/products/123",
  },
];

testCases.forEach((testCase, index) => {
  const result = httpClient.buildFullUrl(testCase.input);
  const isCorrect = result === testCase.expected;
  const hasDuplicate = result.includes("/api/v1/api/v1/");

  console.log(`${index + 1}. ${testCase.input}`);
  console.log(`   Expected: ${testCase.expected}`);
  console.log(`   Result:   ${result}`);
  console.log(`   Status:   ${isCorrect ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`   Duplicate: ${hasDuplicate ? "❌ YES" : "✅ NO"}`);
  console.log("");
});

console.log("🎯 Summary:");
console.log("- URL building should now handle all cases correctly");
console.log("- No more duplicate /api/v1/api/v1/ paths");
console.log("- Both old and new URL patterns work");

console.log("\n💡 To test in browser:");
console.log("1. Start backend server (port 8081)");
console.log("2. Start frontend (port 3001)");
console.log("3. Login as admin");
console.log("4. Try to update a product");
console.log("5. Check network tab for correct URLs");

if (typeof module !== "undefined") {
  module.exports = { FixedHttpClient, testCases };
}
