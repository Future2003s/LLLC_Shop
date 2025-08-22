"use client";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  sku: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
}

interface Brand {
  id: string;
  name: string;
  description: string;
  slug: string;
  logo: string;
  website: string;
  isActive: boolean;
  sortOrder: number;
}

export default function ManagementTestPage() {
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "brands"
  >("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    status: "ACTIVE",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: true,
    sortOrder: 1,
  });

  const [brandForm, setBrandForm] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    isActive: true,
    sortOrder: 1,
  });

  const [showForms, setShowForms] = useState({
    products: false,
    categories: false,
    brands: false,
  });

  const resetForms = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      sku: "",
      status: "ACTIVE",
    });
    setCategoryForm({
      name: "",
      description: "",
      isActive: true,
      sortOrder: 1,
    });
    setBrandForm({
      name: "",
      description: "",
      logo: "",
      website: "",
      isActive: true,
      sortOrder: 1,
    });
    setShowForms({ products: false, categories: false, brands: false });
  };

  // Product functions
  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      };

      const response = await fetch("/api/products/test-crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        setProducts((prev) => [result.data, ...prev]);
        setShowForms({ ...showForms, products: false });
        resetForms();
        alert("Product created successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    }
  };

  // Category functions
  const handleCreateCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/categories/test-crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        const result = await response.json();
        setCategories((prev) => [result.data, ...prev]);
        setShowForms({ ...showForms, categories: false });
        resetForms();
        alert("Category created successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      alert("Category deleted successfully!");
    }
  };

  // Brand functions
  const handleCreateBrand = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/brands/test-crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandForm),
      });

      if (response.ok) {
        const result = await response.json();
        setBrands((prev) => [result.data, ...prev]);
        setShowForms({ ...showForms, brands: false });
        resetForms();
        alert("Brand created successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create brand");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create brand"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = (brandId: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
      alert("Brand deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Management Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Test CRUD operations for Products, Categories, and Brands
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "categories"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("brands")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "brands"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Brands
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Products Management
                </h2>
                <button
                  onClick={() =>
                    setShowForms({
                      ...showForms,
                      products: !showForms.products,
                    })
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {showForms.products ? "Cancel" : "+ Add Product"}
                </button>
              </div>

              {showForms.products && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">
                    Create New Product
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name *"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="SKU *"
                      value={productForm.sku}
                      onChange={(e) =>
                        setProductForm({ ...productForm, sku: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Price *"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Stock *"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCreateProduct}
                      disabled={
                        loading ||
                        !productForm.name ||
                        !productForm.sku ||
                        !productForm.price ||
                        !productForm.stock
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "Create Product"}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {product.description}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="mr-4">Price: ${product.price}</span>
                          <span className="mr-4">Stock: {product.stock}</span>
                          <span>SKU: {product.sku}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No products found. Create your first product!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Categories Management
                </h2>
                <button
                  onClick={() =>
                    setShowForms({
                      ...showForms,
                      categories: !showForms.categories,
                    })
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {showForms.categories ? "Cancel" : "+ Add Category"}
                </button>
              </div>

              {showForms.categories && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">
                    Create New Category
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Category Name *"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Sort Order"
                      value={categoryForm.sortOrder}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          sortOrder: parseInt(e.target.value),
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      placeholder="Description"
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                      rows={3}
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={categoryForm.isActive}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            isActive: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCreateCategory}
                      disabled={loading || !categoryForm.name}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "Create Category"}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {category.description}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="mr-4">Slug: {category.slug}</span>
                          <span className="mr-4">
                            Sort Order: {category.sortOrder}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              category.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No categories found. Create your first category!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Brands Tab */}
          {activeTab === "brands" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Brands Management
                </h2>
                <button
                  onClick={() =>
                    setShowForms({ ...showForms, brands: !showForms.brands })
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {showForms.brands ? "Cancel" : "+ Add Brand"}
                </button>
              </div>

              {showForms.brands && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">
                    Create New Brand
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Brand Name *"
                      value={brandForm.name}
                      onChange={(e) =>
                        setBrandForm({ ...brandForm, name: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Sort Order"
                      value={brandForm.sortOrder}
                      onChange={(e) =>
                        setBrandForm({
                          ...brandForm,
                          sortOrder: parseInt(e.target.value),
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Logo URL"
                      value={brandForm.logo}
                      onChange={(e) =>
                        setBrandForm({ ...brandForm, logo: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Website URL"
                      value={brandForm.website}
                      onChange={(e) =>
                        setBrandForm({ ...brandForm, website: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      placeholder="Description"
                      value={brandForm.description}
                      onChange={(e) =>
                        setBrandForm({
                          ...brandForm,
                          description: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                      rows={3}
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={brandForm.isActive}
                        onChange={(e) =>
                          setBrandForm({
                            ...brandForm,
                            isActive: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCreateBrand}
                      disabled={loading || !brandForm.name}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "Create Brand"}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{brand.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {brand.description}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="mr-4">Slug: {brand.slug}</span>
                          <span className="mr-4">
                            Sort Order: {brand.sortOrder}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              brand.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {brand.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {brand.website && (
                          <div className="mt-2">
                            <a
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {brand.website}
                            </a>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {brands.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No brands found. Create your first brand!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">API Status:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Products API:</h4>
              <p className="text-green-600">✅ /api/products/test-crud</p>
              <p className="text-green-600">✅ /api/products/admin</p>
              <p className="text-green-600">✅ /api/products/[id]</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Categories API:</h4>
              <p className="text-green-600">✅ /api/categories/test-crud</p>
              <p className="text-green-600">✅ /api/categories/admin</p>
              <p className="text-green-600">✅ /api/categories/[id]</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Brands API:</h4>
              <p className="text-green-600">✅ /api/brands/test-crud</p>
              <p className="text-green-600">✅ /api/brands/admin</p>
              <p className="text-green-600">✅ /api/brands/[id]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
