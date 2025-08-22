const puppeteer = require("puppeteer");

async function testProductsPage() {
  console.log("🧪 Testing Frontend Products Page");
  console.log("=".repeat(50));

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false, // Set to true to run without GUI
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();

    // Navigate to products page
    console.log("📱 Navigating to http://localhost:3000/vi/products");
    await page.goto("http://localhost:3000/vi/products", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for products to load
    console.log("⏳ Waiting for products to load...");
    await page.waitForTimeout(3000);

    // Check if products are displayed
    const productCards = await page.$$('.grid > [href*="/products/"]');
    console.log(`✅ Found ${productCards.length} product cards`);

    if (productCards.length > 0) {
      // Get product names
      const productNames = await page.evaluate(() => {
        const cards = document.querySelectorAll('.grid > [href*="/products/"]');
        return Array.from(cards)
          .slice(0, 3)
          .map((card) => {
            const nameElement = card.querySelector("h3");
            return nameElement
              ? nameElement.textContent.trim()
              : "No name found";
          });
      });

      console.log("\n📋 First 3 products:");
      productNames.forEach((name, index) => {
        console.log(`   ${index + 1}. ${name}`);
      });

      // Check for loading indicator
      const loadingElement = await page.$('[class*="loading"]');
      console.log(
        `📊 Loading indicator: ${loadingElement ? "Found" : "Not found"}`
      );

      // Check for empty state
      const emptyStateElement = await page.$('text="Không tìm thấy sản phẩm"');
      console.log(
        `📊 Empty state: ${emptyStateElement ? "Found" : "Not found"}`
      );

      // Take screenshot
      await page.screenshot({
        path: "products-page-test.png",
        fullPage: true,
      });
      console.log("📸 Screenshot saved as products-page-test.png");
    } else {
      console.log("❌ No products found on the page");

      // Check for error messages
      const errorMessage = await page.evaluate(() => {
        return (
          document.body.textContent.includes("Không tìm thấy sản phẩm") ||
          document.body.textContent.includes("Failed to load") ||
          document.body.textContent.includes("Error")
        );
      });

      console.log(`🔍 Error messages found: ${errorMessage}`);

      // Take screenshot for debugging
      await page.screenshot({
        path: "products-page-error.png",
        fullPage: true,
      });
      console.log("📸 Error screenshot saved as products-page-error.png");
    }
  } catch (error) {
    console.error("❌ Test Error:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is available
try {
  testProductsPage();
} catch (error) {
  console.log(
    "❌ Puppeteer not available. Please install with: npm install puppeteer"
  );
  console.log(
    "🔧 Alternative: Visit http://localhost:3000/vi/products manually to test"
  );
}
