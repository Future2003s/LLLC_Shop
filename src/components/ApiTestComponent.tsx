import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

const ApiTestComponent: React.FC = () => {
  const { testConnection, testApi, register, login, error, isLoading } =
    useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    password: "Password123",
  });

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testBackendConnection = async () => {
    try {
      addResult("Testing backend connection (health endpoint)...");
      const result = await testConnection();
      addResult(
        `Backend connection: ${result.success ? "✅ SUCCESS" : "❌ FAILED"} - ${
          result.message
        }`
      );
    } catch (error) {
      addResult(`❌ Connection test error: ${error}`);
    }
  };

  const testApiEndpoint = async () => {
    try {
      addResult("Testing API endpoint (/test)...");
      const result = await testApi();
      addResult(
        `API test: ${result.success ? "✅ SUCCESS" : "❌ FAILED"} - ${
          result.message
        }`
      );
    } catch (error) {
      addResult(`❌ API test error: ${error}`);
    }
  };

  const testRegisterEndpoint = async () => {
    try {
      addResult("Testing /auth/register endpoint...");
      const response = await authService.register(formData);
      addResult(`✅ Register successful: ${response.data.user.email}`);
    } catch (error: any) {
      addResult(
        `❌ Register failed: ${error.payload?.message || error.message}`
      );
    }
  };

  const testLoginEndpoint = async () => {
    try {
      addResult("Testing /auth/login endpoint...");
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      addResult(`✅ Login successful: ${response.data.user.email}`);
    } catch (error: any) {
      addResult(`❌ Login failed: ${error.payload?.message || error.message}`);
    }
  };

  const testAllEndpoints = async () => {
    setTestResults([]);
    addResult(
      "🚀 Starting API endpoint tests based on API_DOCUMENTATION.md..."
    );

    // Test connection first
    await testBackendConnection();
    await testApiEndpoint();

    // Test auth endpoints
    await testRegisterEndpoint();
    await testLoginEndpoint();

    addResult("🏁 All tests completed!");
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🔧 API Test Component (Based on API_DOCUMENTATION.md)
      </h2>

      {/* Form Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={testAllEndpoints}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Test All Endpoints
        </button>
        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔌 Test Health
        </button>
        <button
          onClick={testApiEndpoint}
          disabled={isLoading}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🧪 Test API
        </button>
        <button
          onClick={testRegisterEndpoint}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📝 Test Register
        </button>
        <button
          onClick={testLoginEndpoint}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔑 Test Login
        </button>
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Status */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
          ⏳ Testing in progress...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          ❌ Error: {error}
        </div>
      )}

      {/* Test Results */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Test Results:
        </h3>
        <div className="max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic">
              No test results yet. Click a test button to start.
            </p>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className="mb-2 p-2 bg-white rounded border-l-4 border-blue-500"
              >
                <span className="font-mono text-sm">{result}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
        <h4 className="font-semibold text-yellow-800 mb-2">
          📋 Instructions (Based on API_DOCUMENTATION.md):
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Ensure your Node.js backend is running on port 8081</li>
          <li>• Check that CORS is properly configured</li>
          <li>• Verify the API endpoints exist in your backend</li>
          <li>• Use the test buttons to debug API issues</li>
          <li>• Backend should have /health and /test endpoints</li>
          <li>• Auth endpoints: /auth/register, /auth/login, /auth/me</li>
        </ul>
      </div>

      {/* API Documentation Reference */}
      <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md">
        <h4 className="font-semibold text-blue-800 mb-2">
          📚 API Documentation Reference:
        </h4>
        <p className="text-sm text-blue-700">
          This component tests endpoints based on your{" "}
          <code className="bg-blue-100 px-1 rounded">API_DOCUMENTATION.md</code>{" "}
          file. All endpoints should match exactly with your backend
          implementation.
        </p>
      </div>
    </div>
  );
};

export default ApiTestComponent;
