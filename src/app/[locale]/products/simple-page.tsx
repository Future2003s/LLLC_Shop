export default function SimpleProductsPage() {
  return (
    <html lang="vi">
      <head>
        <title>Simple Products Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <h1>Simple Products Page</h1>
          <p>This page bypasses all layouts and components.</p>
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            <h2>Status: Working ✅</h2>
            <p>If you can see this page, the basic routing is working.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
