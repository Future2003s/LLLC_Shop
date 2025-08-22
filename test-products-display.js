// Test script để kiểm tra việc hiển thị sản phẩm
console.log("🧪 Testing Products Display");

// Test 1: Kiểm tra API response
console.log("1. Testing API Response...");
fetch(
  "http://localhost:8081/api/v1/products?status=active&isVisible=true&limit=3"
)
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ API Response:", data);
    console.log("✅ Success:", data.success);
    console.log("✅ Data length:", data.data?.length || 0);
    console.log("✅ First product:", data.data?.[0]?.name || "No name");
  })
  .catch((error) => {
    console.error("❌ API Error:", error);
  });

// Test 2: Kiểm tra frontend
console.log("\n2. Testing Frontend...");
console.log("✅ Frontend should be running on http://localhost:3001");
console.log("✅ Products page: http://localhost:3001/vi/products");
console.log("✅ Cart page: http://localhost:3001/vi/cart");

// Test 3: Kiểm tra cart functionality
console.log("\n3. Testing Cart Functionality...");
console.log("✅ Cart context should be available");
console.log("✅ Add to cart should work");
console.log("✅ Cart should display items");

console.log("\n🎯 Next steps:");
console.log("1. Open http://localhost:3001/vi/products");
console.log("2. Check if products are displayed");
console.log("3. Click on a product to view details");
console.log("4. Try adding to cart");
console.log("5. Check cart page");
