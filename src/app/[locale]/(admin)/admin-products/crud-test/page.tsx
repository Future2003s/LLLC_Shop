"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  sku: string;
  categoryId?: string;
  brandId?: string;
}

export default function CRUDTestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    categoryId: "",
    brandId: "",
    status: "ACTIVE",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      sku: "",
      categoryId: "",
      brandId: "",
      status: "ACTIVE",
    });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId || undefined,
        brandId: formData.brandId || undefined,
      };

      console.log("Creating test product:", productData);

      const response = await fetch("/api/products/test-crud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Create test product response:", result);

        const newProduct = result.data;
        setProducts((prev) => [newProduct, ...prev]);
        setShowCreateForm(false);
        resetForm();
        alert("Test product created successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create test product");
      }
    } catch (error) {
      console.error("Error creating test product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create test product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId || undefined,
        brandId: formData.brandId || undefined,
      };

      console.log("Updating test product:", editingProduct.id, productData);

      // For test purposes, we'll just update the local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, ...productData } : p
        )
      );
      setEditingProduct(null);
      resetForm();
      alert("Test product updated successfully!");
    } catch (error) {
      console.error("Error updating test product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update test product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this test product?")) {
      return;
    }

    try {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Test product deleted successfully!");
    } catch (error) {
      console.error("Error deleting test product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete test product"
      );
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      sku: product.sku,
      categoryId: product.categoryId || "",
      brandId: product.brandId || "",
      status: product.status,
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowCreateForm(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Products CRUD Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Testing CRUD operations without authentication
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Test Products Management
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Add Test Product
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          {/* Create/Edit Form */}
          {(showCreateForm || editingProduct) && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                {editingProduct
                  ? "Edit Test Product"
                  : "Create New Test Product"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SKU"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category ID
                  </label>
                  <input
                    type="text"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Category ID (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand ID
                  </label>
                  <input
                    type="text"
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brand ID (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Product description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProduct ? handleEdit : handleCreate}
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.sku ||
                    !formData.price ||
                    !formData.stock
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </div>
          )}

          {/* Products List */}
          {products.length > 0 ? (
            <div className="grid gap-4">
              {products.map((product: Product) => (
                <div
                  key={product.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {product.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Price:</span> $
                          {product.price}
                        </div>
                        <div>
                          <span className="font-medium">Stock:</span>{" "}
                          {product.stock}
                        </div>
                        <div>
                          <span className="font-medium">SKU:</span>{" "}
                          {product.sku}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <span
                            className={`ml-1 px-2 py-1 rounded-full text-xs ${
                              product.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : product.status === "INACTIVE"
                                ? "bg-gray-100 text-gray-800"
                                : product.status === "OUT_OF_STOCK"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => startEdit(product)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No test products found</p>
              <p className="text-sm mt-2">
                Click "Add Test Product" to create your first test product.
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Test API Status:</h3>
            <p className="text-sm text-gray-600">
              ✅ Test CRUD endpoint: /api/products/test-crud
            </p>
            <p className="text-sm text-gray-600">
              ✅ Create: Working (simulated)
            </p>
            <p className="text-sm text-gray-600">
              ✅ Read: Working (local state)
            </p>
            <p className="text-sm text-gray-600">
              ✅ Update: Working (local state)
            </p>
            <p className="text-sm text-gray-600">
              ✅ Delete: Working (local state)
            </p>
            <p className="text-sm text-gray-600">
              ✅ No authentication required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
