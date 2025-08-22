const fetch = require("node-fetch");

async function testProductUpdate() {
  console.log("=== TESTING PRODUCT UPDATE API ===");

  // Test data
  const productId = "your_product_id_here"; // Replace with actual product ID
  const updateData = {
    name: "Test Product Updated",
    description: "Updated description",
    price: 150000,
    quantity: 50,
    sku: "TEST-SKU-001",
    status: "active", // This should be one of: draft, active, archived
  };

  console.log("Update payload:", JSON.stringify(updateData, null, 2));

  try {
    // Test without token first
    console.log("\n--- Testing without token ---");
    const responseNoToken = await fetch(
      `http://localhost:3001/api/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Response status (no token):", responseNoToken.status);
    const responseText = await responseNoToken.text();
    console.log("Response body (no token):", responseText);

    // Test with mock token
    console.log("\n--- Testing with mock token ---");
    const responseWithToken = await fetch(
      `http://localhost:3001/api/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock_token_here",
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Response status (with token):", responseWithToken.status);
    const responseText2 = await responseWithToken.text();
    console.log("Response body (with token):", responseText2);
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

// Test backend directly
async function testBackendDirect() {
  console.log("\n=== TESTING BACKEND DIRECTLY ===");

  const productId = "your_product_id_here"; // Replace with actual product ID
  const updateData = {
    name: "Test Product Updated",
    description: "Updated description",
    price: 150000,
    quantity: 50,
    sku: "TEST-SKU-001",
    status: "active",
  };

  try {
    const response = await fetch(
      `http://localhost:8081/api/v1/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your_actual_token_here", // Replace with real token
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Backend response status:", response.status);
    const responseText = await response.text();
    console.log("Backend response body:", responseText);
  } catch (error) {
    console.error("Error testing backend:", error);
  }
}

// Run tests
testProductUpdate()
  .then(() => {
    console.log("\n=== FRONTEND API TEST COMPLETE ===");
    return testBackendDirect();
  })
  .then(() => {
    console.log("\n=== ALL TESTS COMPLETE ===");
  })
  .catch(console.error);
