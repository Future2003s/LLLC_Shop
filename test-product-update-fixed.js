const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BASE_URL = "http://localhost:3000";

async function testProductUpdateFixed() {
  console.log("🧪 Test Product Update API (Fixed Images Format)\n");

  // Test 1: Test with correct images format
  console.log("1. Testing UPDATE product with correct images format...");
  try {
    const updateData = {
      name: "Updated Product Name",
      description: "Updated description for testing",
      price: 99.99,
      sku: "TEST-SKU-001",
      images: [
        {
          url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
          alt: "Updated Product Image 1",
          isMain: true,
          order: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
          alt: "Updated Product Image 2",
          isMain: false,
          order: 1,
        },
      ],
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
      console.log("✅ UPDATE product working with correct images format");
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

  // Test 2: Test with minimal data (no images)
  console.log("2. Testing UPDATE product with minimal data...");
  try {
    const minimalData = {
      name: "Minimal Update Test",
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
  console.log("- If you get 401, you need to login as admin first");
  console.log("- If you get 400, check the validation error details");
  console.log("- If you get 200, the update is working correctly");
  console.log("- Make sure you are logged in as admin in the browser");

  rl.close();
}

testProductUpdateFixed();
