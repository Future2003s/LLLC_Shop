const axios = require("axios");

async function testProductDetail() {
  console.log("🧪 Testing Product Detail API");
  console.log("=".repeat(40));

  try {
    // Get a product ID from the list
    console.log("1. Getting product list...");
    const listResponse = await axios.get(
      "http://localhost:8081/api/v1/products?status=active&limit=1"
    );

    if (listResponse.data.data.length === 0) {
      console.log("❌ No products found");
      return;
    }

    const productId = listResponse.data.data[0]._id;
    console.log(
      `✅ Found product: ${listResponse.data.data[0].name} (ID: ${productId})`
    );

    // Test product detail API
    console.log("\n2. Testing product detail API...");
    const detailResponse = await axios.get(
      `http://localhost:8081/api/v1/products/${productId}`
    );

    console.log(`✅ Status: ${detailResponse.status}`);
    console.log(`✅ Product name: ${detailResponse.data.data.name}`);
    console.log(`✅ Price: ${detailResponse.data.data.price}`);
    console.log(
      `✅ Images count: ${detailResponse.data.data.images?.length || 0}`
    );

    if (detailResponse.data.data.images?.length > 0) {
      console.log("📸 First image:", detailResponse.data.data.images[0]);
    }

    console.log(
      `✅ Category: ${JSON.stringify(detailResponse.data.data.category)}`
    );
    console.log(`✅ Brand: ${JSON.stringify(detailResponse.data.data.brand)}`);
    console.log(
      `✅ Variants count: ${detailResponse.data.data.variants?.length || 0}`
    );
  } catch (error) {
    console.error("❌ API Test Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testProductDetail();
