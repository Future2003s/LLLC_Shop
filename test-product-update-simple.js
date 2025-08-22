const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BASE_URL = "http://localhost:3000";

async function testProductUpdateSimple() {
  console.log("🧪 Test Product Update API (Simple Data)\n");

  // Test 1: Test with minimal data
  console.log("1. Testing UPDATE product with minimal data...");
  try {
    const updateData = {
      name: "Simple Update Test",
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
      console.log("✅ UPDATE product working with minimal data");
    } else {
      console.log("❌ UPDATE product failed");
      if (response.status === 400) {
        console.log("🔍 400 Bad Request - Validation error");
        console.log("Check the validation error details above");
      } else if (response.status === 401) {
        console.log("🔒 401 Unauthorized - Authentication required");
        console.log("You need to login as admin first");
      } else if (response.status === 403) {
        console.log("🚫 403 Forbidden - Authorization required");
      }
    }
  } catch (error) {
    console.log("❌ UPDATE product error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Test with name and description only
  console.log("2. Testing UPDATE product with name and description...");
  try {
    const updateData = {
      name: "Updated Product Name",
      description: "This is an updated description for testing purposes.",
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
      console.log("✅ UPDATE product working with name and description");
    } else {
      console.log("❌ UPDATE product failed");
    }
  } catch (error) {
    console.log("❌ UPDATE product error:", error.message);
  }

  console.log("\n📋 Summary:");
  console.log("- If you get 401, you need to login as admin first");
  console.log("- If you get 400, check the validation error details");
  console.log("- If you get 200, the update is working correctly");
  console.log("- Make sure you are logged in as admin in the browser");
  console.log("- Check backend logs for detailed validation errors");

  rl.close();
}

testProductUpdateSimple();
