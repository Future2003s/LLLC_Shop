"use client";
import { useState, useEffect } from "react";

export default function AdminOrdersDebugPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testOrdersAPI = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      console.log("🔍 Testing admin orders API...");

      const response = await fetch("/api/orders/admin/all?page=1&limit=10", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      console.log("📊 Response status:", response.status);
      console.log(
        "📋 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const text = await response.text();
      console.log("📄 Raw response:", text);

      if (response.ok) {
        const result = text ? JSON.parse(text) : null;
        setData(result);
        console.log("✅ Success:", result);
      } else {
        setError(`API Error: ${response.status} - ${text}`);
        console.error("❌ Error:", text);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      console.error("💥 Exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testOrdersAPI();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔧 Admin Orders API Debug</h1>

      <div className="space-y-4">
        <button
          onClick={testOrdersAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "⏳ Testing..." : "🔄 Test API"}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="text-red-800 font-medium">❌ Error:</h3>
            <pre className="text-red-600 text-sm mt-2 whitespace-pre-wrap">
              {error}
            </pre>
          </div>
        )}

        {data && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="text-green-800 font-medium">✅ Success Response:</h3>
            <pre className="text-green-600 text-sm mt-2 whitespace-pre-wrap overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {!error && !data && !loading && (
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <p className="text-gray-600">
              Click "Test API" to check the orders endpoint
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-blue-800 font-medium mb-2">🔍 Debug Info:</h3>
        <ul className="text-blue-600 text-sm space-y-1">
          <li>
            • API Endpoint: <code>/api/orders/admin/all</code>
          </li>
          <li>• Method: GET with credentials</li>
          <li>• Expected: Orders list with pagination</li>
          <li>• Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
}
