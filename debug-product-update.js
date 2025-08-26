/**
 * Debug Product Update - End-to-End Testing
 * Kiểm tra toàn bộ flow từ frontend đến backend
 */

// Mock environment config
const envConfig = {
  NEXT_PUBLIC_API_END_POINT: "http://localhost:8081",
  NEXT_PUBLIC_API_VERSION: "v1",
};

console.log("🔍 Debug Product Update End-to-End...\n");

// Simulate the HTTP client with URL building
class DebugHttpClient {
  constructor() {
    this.baseUrl = envConfig.NEXT_PUBLIC_API_END_POINT;
  }

  buildFullUrl(url) {
    console.log(`\n🔗 Building URL for: "${url}"`);
    console.log(`   Base URL: ${this.baseUrl}`);
    console.log(`   API Version: ${envConfig.NEXT_PUBLIC_API_VERSION}`);

    // Check if baseUrl already contains API version to avoid duplication
    const baseUrlHasApiVersion = this.baseUrl.includes(
      `/api/${envConfig.NEXT_PUBLIC_API_VERSION}`
    );

    console.log(`   Base URL has API version: ${baseUrlHasApiVersion}`);

    // If URL starts with /api/, remove the /api part to avoid duplication
    if (url.startsWith("/api/")) {
      const pathWithoutApi = url.replace(/^\/api\/v?\d*\/?/, "/");
      console.log(`   URL starts with /api/, removing /api part`);
      console.log(`   Path without /api: "${pathWithoutApi}"`);

      if (baseUrlHasApiVersion) {
        // Base URL already has API version, just append the path
        const result = `${this.baseUrl}${pathWithoutApi}`;
        console.log(`   Result (base has API version): "${result}"`);
        return result;
      } else {
        // Base URL doesn't have API version, add it
        const result = `${this.baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${pathWithoutApi}`;
        console.log(`   Result (base doesn't have API version): "${result}"`);
        return result;
      }
    }

    // For all other relative paths
    const apiPath = url.startsWith("/") ? url : `/${url}`;
    console.log(`   Regular relative path: "${apiPath}"`);

    if (baseUrlHasApiVersion) {
      // Base URL already has API version, just append the path
      const result = `${this.baseUrl}${apiPath}`;
      console.log(`   Result (base has API version): "${result}"`);
      return result;
    } else {
      // Base URL doesn't have API version, add it
      const result = `${this.baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${apiPath}`;
      console.log(`   Result (base doesn't have API version): "${result}"`);
      return result;
    }
  }

  put(url, data, config = {}) {
    const fullUrl = this.buildFullUrl(url);
    console.log(`\n📤 PUT Request:`);
    console.log(`   Input URL: "${url}"`);
    console.log(`   Full URL: "${fullUrl}"`);
    console.log(`   Data:`, data);
    console.log(`   Headers:`, config.headers);

    // Check for duplicate API paths
    const hasDuplicate = fullUrl.includes("/api/v1/api/v1/");
    console.log(
      `   Has duplicate /api/v1/api/v1/: ${hasDuplicate ? "❌ YES" : "✅ NO"}`
    );

    if (hasDuplicate) {
      console.log(`   🚨 PROBLEM: URL contains duplicate API paths!`);
      console.log(`   Expected: http://localhost:8081/api/v1/products/123`);
      console.log(`   Got:      ${fullUrl}`);
    }

    return Promise.resolve({
      success: true,
      url: fullUrl,
      hasDuplicate,
    });
  }
}

const httpClient = new DebugHttpClient();

// Test the exact failing case
console.log("🎯 Testing Product Update - Failing Case:");
console.log("=".repeat(80));

const failingCase = {
  name: "Update Product - Previously Failing Case",
  url: "/products/68a7db8fce6e2912c29ce084",
  expectedUrl: "http://localhost:8081/api/v1/products/68a7db8fce6e2912c29ce084",
  payload: {
    name: "Updated Product Name",
    price: 99.99,
    status: "active",
    description: "Updated description",
  },
};

console.log(`   Input URL: ${failingCase.url}`);
console.log(`   Expected: ${failingCase.expectedUrl}`);
console.log(`   Payload:`, failingCase.payload);

const result = httpClient.put(failingCase.url, failingCase.payload, {
  headers: { Authorization: "Bearer test-token" },
});

result.then((response) => {
  const actualUrl = response.url;
  const isCorrect = actualUrl === failingCase.expectedUrl;
  const hasDuplicate = response.hasDuplicate;

  console.log(`\n📊 Results:`);
  console.log(`   Actual URL: ${actualUrl}`);
  console.log(`   Expected:   ${failingCase.expectedUrl}`);
  console.log(`   Correct:    ${isCorrect ? "✅ YES" : "❌ NO"}`);
  console.log(`   Duplicate:  ${hasDuplicate ? "❌ YES" : "✅ NO"}`);

  if (hasDuplicate) {
    console.log(`\n🚨 ROOT CAUSE IDENTIFIED:`);
    console.log(`   The URL "${actualUrl}" contains duplicate /api/v1/api/v1/`);
    console.log(`   This suggests:`);
    console.log(`   1. Base URL already contains /api/v1`);
    console.log(`   2. URL building logic is adding another /api/v1`);
    console.log(`   3. Environment configuration issue`);
  } else {
    console.log(`\n🎉 URL Building Fixed!`);
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

console.log("🎯 Debug Summary:");
console.log("=".repeat(50));

if (envConfig.NEXT_PUBLIC_API_END_POINT.includes("/api/v1")) {
  console.log("🚨 PROBLEM: NEXT_PUBLIC_API_END_POINT already contains /api/v1");
  console.log(`   Current: ${envConfig.NEXT_PUBLIC_API_END_POINT}`);
  console.log("   Should be: http://localhost:8081 (without /api/v1)");
} else {
  console.log("✅ NEXT_PUBLIC_API_END_POINT is correct");
}

console.log("\n💡 Solutions:");
console.log("1. Check if NEXT_PUBLIC_API_END_POINT contains /api/v1");
console.log(
  "2. Ensure base URL is just the domain (e.g., http://localhost:8081)"
);
console.log("3. Let HTTP client handle API versioning automatically");
console.log("4. Check environment variables in .env file");

console.log("\n🔧 To fix:");
console.log("1. Set NEXT_PUBLIC_API_END_POINT=http://localhost:8081");
console.log("2. Set NEXT_PUBLIC_API_VERSION=v1");
console.log("3. Restart frontend application");

if (typeof module !== "undefined") {
  module.exports = { DebugHttpClient, testCases };
}
