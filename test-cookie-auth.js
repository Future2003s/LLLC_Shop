const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BASE_URL = "http://localhost:3000";

async function testCookieAuth() {
  console.log("🍪 Test Cookie Authentication\n");

  // Test 1: Check if /api/auth/me works
  console.log("1. Testing /api/auth/me...");
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      if (data.user) {
        console.log(
          "✅ User authenticated:",
          data.user.email,
          "Role:",
          data.user.role
        );
      } else {
        console.log("⚠️  No user found - need to login first");
      }
    } else {
      console.log("❌ /api/auth/me failed");
    }
  } catch (error) {
    console.log("❌ /api/auth/me error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Check if we can get a product
  console.log("2. Testing GET product...");
  try {
    const response = await fetch(
      `${BASE_URL}/api/products/68a5b80fa7815bf6c31b7318`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ GET product working");
    } else {
      console.log("❌ GET product failed");
    }
  } catch (error) {
    console.log("❌ GET product error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Check if we can update a product (should fail without auth)
  console.log("3. Testing UPDATE product without auth...");
  try {
    const updateData = {
      name: "Test Update",
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

    if (response.status === 401) {
      console.log("✅ Correctly rejected without authentication");
    } else if (response.ok) {
      console.log("⚠️  Unexpected success without authentication");
    } else {
      console.log("❌ Unexpected error:", response.status);
    }
  } catch (error) {
    console.log("❌ UPDATE product error:", error.message);
  }

  console.log("\n📋 Summary:");
  console.log("- If /api/auth/me returns no user, you need to login first");
  console.log("- Make sure you are logged in as admin in the browser");
  console.log("- Check if sessionToken cookie exists in browser dev tools");
  console.log("- Try logging out and logging back in");

  rl.close();
}

testCookieAuth();
