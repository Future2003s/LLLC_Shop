const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BASE_URL = "http://localhost:3000";
const BACKEND_URL = "http://localhost:8081";

async function testProductUpdate() {
  console.log("🧪 Test Product Update API\n");

  // Test 1: Test frontend API route
  console.log("1. Testing Frontend API Route...");
  try {
    const updateData = {
      name: "Updated Product Name",
      description: "Updated description for testing",
      price: 99.99,
      sku: "TEST-SKU-001",
    };

    const response = await fetch(
      `${BASE_URL}/api/products/68a5b80fa7815bf6c31b7318`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Frontend API working");
    } else {
      console.log("❌ Frontend API failed");
      if (response.status === 400) {
        console.log("🔍 400 Bad Request - Validation error");
      } else if (response.status === 401) {
        console.log("🔒 401 Unauthorized - Authentication required");
      } else if (response.status === 403) {
        console.log("🚫 403 Forbidden - Authorization required");
      }
    }
  } catch (error) {
    console.log("❌ Frontend API error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Test backend API directly
  console.log("2. Testing Backend API Directly...");
  try {
    const updateData = {
      name: "Updated Product Name",
      description: "Updated description for testing",
      price: 99.99,
      sku: "TEST-SKU-001",
    };

    const response = await fetch(
      `${BACKEND_URL}/api/v1/products/68a5b80fa7815bf6c31b7318`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with actual token
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Backend API working");
    } else {
      console.log("❌ Backend API failed");
      if (response.status === 400) {
        console.log("🔍 400 Bad Request - Validation error");
      } else if (response.status === 401) {
        console.log("🔒 401 Unauthorized - Authentication required");
      } else if (response.status === 403) {
        console.log("🚫 403 Forbidden - Authorization required");
      }
    }
  } catch (error) {
    console.log("❌ Backend API error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Test with minimal data
  console.log("3. Testing with Minimal Data...");
  try {
    const minimalData = {
      name: "Minimal Update",
    };

    const response = await fetch(
      `${BASE_URL}/api/products/68a5b80fa7815bf6c31b7318`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(minimalData),
      }
    );

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Minimal update working");
    } else {
      console.log("❌ Minimal update failed");
    }
  } catch (error) {
    console.log("❌ Minimal update error:", error.message);
  }

  console.log("\n📋 Summary:");
  console.log("- Check if you are logged in as admin in the browser");
  console.log("- Check browser network tab for request/response details");
  console.log("- Check backend logs for validation errors");
  console.log("- Make sure the product ID exists in the database");

  rl.close();
}

testProductUpdate();
