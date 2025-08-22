// Test config production
console.log("Testing production config...");

// Simulate production environment
process.env.NODE_ENV = "production";
process.env.NEXT_PUBLIC_IS_PRODUCTION = "true";

// Import config
const { envConfig } = require("./src/config.ts");

console.log("Production Config:", {
  API_ENDPOINT: envConfig.NEXT_PUBLIC_API_END_POINT,
  BACKEND_URL: envConfig.NEXT_PUBLIC_BACKEND_URL,
  IS_PRODUCTION: envConfig.NEXT_PUBLIC_IS_PRODUCTION,
  FRONTEND_URL: envConfig.NEXT_PUBLIC_URL,
});

// Test API connection
const testAPI = async () => {
  try {
    const response = await fetch(
      `${envConfig.NEXT_PUBLIC_API_END_POINT}/api/v1/health`
    );
    const data = await response.json();
    console.log("✅ API connection successful:", data);
  } catch (error) {
    console.error("❌ API connection failed:", error.message);
  }
};

testAPI();
