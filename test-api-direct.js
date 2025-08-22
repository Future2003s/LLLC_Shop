// Test script để kiểm tra API call trực tiếp
console.log("🧪 Testing API Call Directly");

// Test 1: Kiểm tra API endpoint
console.log("1. Testing API Endpoint...");
const apiUrl =
  "http://localhost:8081/api/v1/products?status=active&isVisible=true&limit=3";
console.log("🔗 API URL:", apiUrl);

// Test 2: Kiểm tra fetch
console.log("\n2. Testing Fetch...");
fetch(apiUrl)
  .then((response) => {
    console.log("✅ Response status:", response.status);
    console.log("✅ Response ok:", response.ok);
    return response.json();
  })
  .then((data) => {
    console.log("✅ Response data:", data);
    console.log("✅ Success:", data.success);
    console.log("✅ Data length:", data.data?.length || 0);
    console.log("✅ First product:", data.data?.[0]?.name || "No name");
  })
  .catch((error) => {
    console.error("❌ Fetch Error:", error);
  });

// Test 3: Kiểm tra với XMLHttpRequest
console.log("\n3. Testing XMLHttpRequest...");
const xhr = new XMLHttpRequest();
xhr.open("GET", apiUrl);
xhr.onload = function () {
  if (xhr.status === 200) {
    try {
      const data = JSON.parse(xhr.responseText);
      console.log("✅ XHR Response:", data);
      console.log("✅ Success:", data.success);
      console.log("✅ Data length:", data.data?.length || 0);
    } catch (e) {
      console.error("❌ XHR Parse Error:", e);
    }
  } else {
    console.error("❌ XHR Error:", xhr.status, xhr.statusText);
  }
};
xhr.onerror = function () {
  console.error("❌ XHR Network Error");
};
xhr.send();

console.log("\n🎯 Check browser console for results");
