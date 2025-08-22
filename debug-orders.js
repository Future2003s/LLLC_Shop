// Debug script for admin orders API
const BASE_URL = "http://localhost:3000";

async function testAdminOrders() {
  console.log("🔍 Testing Admin Orders API...\n");

  try {
    // Test frontend API endpoint
    console.log("📡 Calling frontend API...");
    const response = await fetch(
      `${BASE_URL}/api/orders/admin/all?page=1&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Simulate browser request with cookies
          Cookie: "sessionToken=test-token; refreshToken=test-refresh",
        },
      }
    );

    console.log("📊 Response status:", response.status);
    console.log(
      "📋 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const text = await response.text();
    console.log("📄 Response body:", text);

    if (response.ok) {
      const data = JSON.parse(text);
      console.log("✅ Success! Data structure:", Object.keys(data));
    } else {
      console.log("❌ Error response");
    }
  } catch (error) {
    console.error("💥 Request failed:", error.message);
  }
}

// Check if we can reach frontend
async function testFrontendHealth() {
  try {
    console.log("🏥 Testing frontend health...");
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: "GET",
    });

    if (response.ok) {
      console.log("✅ Frontend is running");
    } else {
      console.log("⚠️ Frontend may have issues");
    }
  } catch (error) {
    console.error("❌ Frontend not reachable:", error.message);
  }
}

async function runDebug() {
  console.log("🚀 Starting Debug Session\n");
  await testFrontendHealth();
  console.log();
  await testAdminOrders();
  console.log("\n✨ Debug completed!");
}

runDebug().catch(console.error);
