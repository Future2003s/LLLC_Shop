"use client";

import { useState, useEffect } from "react";
import { productApiRequest } from "@/apiRequests/products";
import { envConfig } from "@/config";

export default function TestApiPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    console.log("🧪 Testing Direct Fetch");
    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/products?limit=3"
      );
      const data = await response.json();
      console.log("Direct fetch result:", data);
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error("Direct fetch error:", error);
      return { success: false, error: (error as Error).message };
    }
  };

  const testProductApiRequest = async () => {
    console.log("🧪 Testing productApiRequest");
    try {
      const data = await productApiRequest.getProducts({ limit: 3 });
      console.log("ProductApiRequest result:", data);
      return { success: true, data };
    } catch (error) {
      console.error("ProductApiRequest error:", error);
      return { success: false, error: (error as Error).message };
    }
  };

  const testConfig = () => {
    console.log("🧪 Testing Config");
    console.log("envConfig:", envConfig);
    return envConfig;
  };

  const runAllTests = async () => {
    setLoading(true);
    console.log("🚀 Running all tests...");

    const config = testConfig();
    const directFetch = await testDirectFetch();
    const apiRequest = await testProductApiRequest();

    setResults({
      config,
      directFetch,
      apiRequest,
      timestamp: new Date().toISOString(),
    });

    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <button
        onClick={runAllTests}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Run Tests"}
      </button>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Config Test</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(results.config, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Direct Fetch Test</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(results.directFetch, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">
            Product API Request Test
          </h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(results.apiRequest, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
