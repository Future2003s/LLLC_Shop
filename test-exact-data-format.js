const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BASE_URL = "http://localhost:3000";

async function testExactDataFormat() {
  console.log("🧪 Test Product Update API (Exact Data Format)\n");

  // Test with the exact data format from user
  console.log("1. Testing UPDATE product with exact data format...");
  try {
    const updateData = {
      name: "MacBook Air M2",
      description:
        "Laptop mỏng nhẹ với chip M2 mạnh mẽ cho công việc và sáng tạo. Màn hình Liquid Retina 13.6 inch, pin lên đến 18 giờ, thiết kế siêu mỏng.",
      price: 31990000,
      quantity: 26,
      sku: "MBA-M2-001",
      status: "draft",
      images: [
        {
          url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
          alt: "Product image 1",
          isMain: true,
          order: 0,
        },
      ],
    };

    console.log("Sending data:", JSON.stringify(updateData, null, 2));

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
      console.log("✅ UPDATE product working with exact data format");
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

  // Test 2: Test with minimal data to isolate issues
  console.log("2. Testing UPDATE product with minimal data...");
  try {
    const minimalData = {
      name: "Test Update",
    };

    console.log("Sending minimal data:", JSON.stringify(minimalData, null, 2));

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
  console.log("- Check backend logs for detailed validation errors");
  console.log("- Data format looks correct according to schema");

  rl.close();
}

testExactDataFormat();
