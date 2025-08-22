// Test script for orders API
const BASE_URL = "http://localhost:3000";

async function testOrdersAPI() {
  console.log("🔍 Testing Orders API...\n");

  try {
    // Test 1: Check if frontend is running
    console.log("1️⃣ Testing frontend health...");
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    console.log("   Health status:", healthResponse.status);

    // Test 2: Test orders API endpoint
    console.log("\n2️⃣ Testing orders API...");
    const ordersResponse = await fetch(
      `${BASE_URL}/api/orders/admin/all?page=1&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("   Orders API status:", ordersResponse.status);
    console.log(
      "   Orders API headers:",
      Object.fromEntries(ordersResponse.headers.entries())
    );

    const text = await ordersResponse.text();
    console.log("   Response body:", text);

    if (ordersResponse.ok) {
      try {
        const data = JSON.parse(text);
        console.log("   ✅ Success! Data keys:", Object.keys(data));
        console.log("   📊 Orders count:", data.data?.length || 0);
      } catch (e) {
        console.log("   ⚠️ Response is not JSON");
      }
    } else {
      console.log("   ❌ API call failed");
    }
  } catch (error) {
    console.error("💥 Test failed:", error.message);
  }
}

// Run test
testOrdersAPI().catch(console.error);
