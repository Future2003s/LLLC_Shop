"use client";

export default function TestProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test Products Page
          </h1>
          <p className="text-lg text-gray-600">
            This is a simple test page to check if the routing works.
          </p>
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Status: Working ✅
            </h2>
            <p className="text-gray-600">
              If you can see this page, the routing is working correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
