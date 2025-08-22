const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BASE_URL = "http://localhost:3000";

async function testProductOperations() {
  console.log("🧪 Test Product Operations\n");

  // Test GET product
  console.log("1. Testing GET product...");
  try {
    const response = await fetch(`${BASE_URL}/api/products/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

  // Test UPDATE product
  console.log("2. Testing UPDATE product...");
  try {
    const updateData = {
      name: "Updated Product Name",
      description: "Updated description",
      price: 99.99,
    };

    const response = await fetch(`${BASE_URL}/api/products/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ UPDATE product working");
    } else {
      console.log("❌ UPDATE product failed");
      if (response.status === 401 || response.status === 403) {
        console.log("🔒 Authentication/Authorization issue detected");
      }
    }
  } catch (error) {
    console.log("❌ UPDATE product error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Ask if user wants to test DELETE
  rl.question(
    "Do you want to test DELETE operation? (y/N): ",
    async (answer) => {
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        console.log("3. Testing DELETE product...");
        try {
          const response = await fetch(`${BASE_URL}/api/products/test-id`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Status:", response.status);
          const data = await response.json();
          console.log("Response:", JSON.stringify(data, null, 2));

          if (response.ok) {
            console.log("✅ DELETE product working");
          } else {
            console.log("❌ DELETE product failed");
            if (response.status === 401 || response.status === 403) {
              console.log("🔒 Authentication/Authorization issue detected");
            }
          }
        } catch (error) {
          console.log("❌ DELETE product error:", error.message);
        }
      }

      console.log("\n📋 Summary:");
      console.log("- Make sure you are logged in as admin in the browser");
      console.log("- Check browser network tab for more details");
      console.log("- Check backend logs for authentication errors");

      rl.close();
    }
  );
}

testProductOperations();
