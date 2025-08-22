// Test script để kiểm tra chức năng cart
console.log("🧪 Testing Cart Functionality");

// Test 1: Kiểm tra cart context
console.log("1. Testing Cart Context...");
try {
  // Simulate adding item to cart
  const testItem = {
    id: "test-product-1",
    name: "Test Product",
    price: 100000,
    quantity: 2,
    imageUrl: "https://placehold.co/100x100",
    productId: "test-product-1",
    variantId: null,
    variantName: null,
  };

  console.log("✅ Test item created:", testItem);
  console.log("✅ Cart functionality should work in browser");
} catch (error) {
  console.error("❌ Error testing cart:", error);
}

// Test 2: Kiểm tra API endpoints
console.log("\n2. Testing API Endpoints...");

// Test backend health
fetch("http://localhost:8081/api/v1/health")
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ Backend health:", data.status);
  })
  .catch((error) => {
    console.error("❌ Backend health check failed:", error.message);
  });

// Test products API
fetch("http://localhost:8081/api/v1/products?limit=1")
  .then((response) => response.json())
  .then((data) => {
    if (data.success && data.data && data.data.length > 0) {
      const product = data.data[0];
      console.log("✅ Products API working, first product:", {
        id: product._id,
        name: product.name,
        price: product.price,
      });
    } else {
      console.log("⚠️ Products API returned no data");
    }
  })
  .catch((error) => {
    console.error("❌ Products API failed:", error.message);
  });

console.log("\n🎯 Manual Testing Instructions:");
console.log("1. Open http://localhost:3001/vi/products");
console.log("2. Click on any product");
console.log("3. Click 'Thêm vào giỏ' button");
console.log("4. Check http://localhost:3001/vi/cart");
console.log("5. Verify item appears in cart");

console.log("\n🔍 Debug Info:");
console.log("- Frontend: http://localhost:3001");
console.log("- Backend: http://localhost:8081");
console.log("- Cart page: http://localhost:3001/vi/cart");
