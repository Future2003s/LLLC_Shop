"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import ProductModal from "./components/ProductModal";
import ProductViewModal from "./components/ProductViewModal";

import { useAppContextProvider } from "@/context/app-context";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 12;
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Modal states
  const [viewing, setViewing] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { sessionToken } = useAppContextProvider();

  // Handler functions
  const handleView = async (productId: string) => {
    try {
      // Tìm sản phẩm trong danh sách hiện tại thay vì gọi API
      const product = products.find((p) => p.id === productId);
      if (product) {
        setViewing(product);
      } else {
        // Nếu không tìm thấy trong danh sách, gọi API
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
          headers: sessionToken
            ? { Authorization: `Bearer ${sessionToken}` }
            : undefined,
        });
        if (response.ok) {
          const data = await response.json();
          setViewing(data.data || data);
        } else {
          throw new Error("Failed to fetch product");
        }
      }
    } catch (error) {
      toast.error("Không thể tải chi tiết sản phẩm");
      console.error("Error viewing product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (productId: string) => {
    try {
      // Tìm sản phẩm trong danh sách hiện tại thay vì gọi API
      const product = products.find((p) => p.id === productId);
      if (product) {
        setEditing(product);
      } else {
        // Nếu không tìm thấy trong danh sách, gọi API
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
          headers: sessionToken
            ? { Authorization: `Bearer ${sessionToken}` }
            : undefined,
        });
        if (response.ok) {
          const data = await response.json();
          setEditing(data.data || data);
        } else {
          throw new Error("Failed to fetch product");
        }
      }
    } catch (error) {
      toast.error("Không thể tải thông tin sản phẩm");
      console.error("Error loading product for edit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      setDeletingId(productId);
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: sessionToken
          ? { Authorization: `Bearer ${sessionToken}` }
          : undefined,
      });

      if (response.ok) {
        // Cập nhật state local thay vì gọi lại API
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        // Đóng modal nếu đang xem sản phẩm bị xóa
        if (viewing?.id === productId) {
          setViewing(null);
        }
        if (editing?.id === productId) {
          setEditing(null);
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error(
            "Bạn không có quyền xóa sản phẩm. Cần tài khoản Admin hoặc Seller."
          );
        } else if (response.status === 400) {
          const t = await response.text().catch(() => "");
          toast.error("Xóa thất bại: Dữ liệu không hợp lệ");
          console.error("Validation error:", t);
        } else {
          const errorText = await response.text().catch(() => "");
          console.error(
            "Failed to delete product, status:",
            response.status,
            errorText
          );
          toast.error("Không thể xóa sản phẩm");
        }
        return;
      }
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
      console.error("Error deleting product:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (updatedProduct: any) => {
    try {
      setSaving(true);

      // Ensure status is valid before sending
      if (
        !updatedProduct.status ||
        !["draft", "active", "archived"].includes(updatedProduct.status)
      ) {
        console.warn(
          "Invalid status detected, setting to draft:",
          updatedProduct.status
        );
        updatedProduct.status = "draft";
      }

      // Remove any empty or undefined fields that might cause backend validation issues
      Object.keys(updatedProduct).forEach((key) => {
        if (updatedProduct[key] === "" || updatedProduct[key] === undefined) {
          delete updatedProduct[key];
        }
      });
      console.log("=== UPDATE PRODUCT DEBUG ===");
      console.log("Product ID being updated:", editing.id);
      console.log("Current product state:", editing);
      console.log("Update payload being sent:", updatedProduct);
      console.log("Status being sent:", updatedProduct.status);
      console.log("Status type:", typeof updatedProduct.status);

      const response = await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify(updatedProduct),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Success response data:", responseData);

        const backend = responseData?.data || responseData;
        // Map backend response back to UI shape
        const mapped = {
          id: backend._id || backend.id || editing.id,
          name: backend.name || editing.name,
          category: backend.category?.name || editing.category,
          price: backend.price ?? editing.price,
          stock: backend.quantity ?? backend.stock ?? editing.stock,
          status:
            backend.status === "active"
              ? "ACTIVE"
              : backend.status === "archived"
              ? "INACTIVE"
              : backend.status === "draft"
              ? "DRAFT"
              : backend.status === "ACTIVE"
              ? "ACTIVE"
              : backend.status === "ARCHIVED"
              ? "INACTIVE"
              : editing.status || "DRAFT",
          sku: backend.sku ?? editing.sku,
          brand: backend.brand?.name || editing.brand,
          image:
            backend.thumbnail ||
            backend.imageUrl ||
            (backend.images && backend.images.length > 0
              ? typeof backend.images[0] === "string"
                ? backend.images[0]
                : backend.images[0]?.url
              : editing.image),
          description: backend.description ?? editing.description,
          categoryId:
            backend.category?._id || backend.category?.id || editing.categoryId,
          brandId: backend.brand?._id || backend.brand?.id || editing.brandId,
          images: Array.isArray(backend.images)
            ? backend.images.map((img: any) =>
                typeof img === "string" ? img : img.url
              )
            : editing.images || [],
          createdAt: backend.createdAt ?? editing.createdAt,
          updatedAt: backend.updatedAt ?? new Date().toISOString(),
        };

        console.log("Mapped product data:", mapped);
        console.log("=== END UPDATE DEBUG ===");

        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...mapped } : p))
        );
        // Re-sync from server to avoid any stale local mapping
        try {
          await fetchProducts();
        } catch (e) {
          console.warn(
            "Soft refresh after update failed, keeping local state.",
            e
          );
        }
        setEditing(null);
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error(
            "Bạn không có quyền cập nhật sản phẩm. Cần tài khoản Admin hoặc Seller."
          );
          return;
        }
        if (response.status === 400) {
          const errorText = await response.text().catch(() => "");
          console.error("Validation error response:", errorText);

          // Try to parse error for better user feedback
          let errorMessage = "Cập nhật thất bại: Dữ liệu không hợp lệ";
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error) {
              errorMessage = `Lỗi validation: ${errorData.error}`;
            }
          } catch (e) {
            // If can't parse JSON, use the text directly
            if (errorText.includes("createdBy")) {
              errorMessage = "Lỗi: Thiếu thông tin người tạo";
            } else if (errorText.includes("status")) {
              errorMessage = "Lỗi: Trạng thái sản phẩm không hợp lệ";
            }
          }

          toast.error(errorMessage);
          return;
        }
        // Try to parse JSON; fall back to text
        let errorPayload: any = null;
        try {
          errorPayload = await response.json();
        } catch (e) {
          const text = await response.text().catch(() => "");
          errorPayload = { message: text };
        }
        console.error("Error response:", errorPayload);
        throw new Error(
          `Failed to update product: ${
            errorPayload?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error("Không thể cập nhật sản phẩm");
      console.error("Error updating product:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (productData: any) => {
    try {
      setSaving(true);
      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const resultText = await response.text();
        let result: any = {};
        try {
          result = resultText ? JSON.parse(resultText) : {};
        } catch {
          result = {};
        }
        console.log("Create product response:", result);

        const backend = result?.data || result;
        // Map to UI shape if possible
        const mapped = {
          id: backend._id || backend.id,
          name: backend.name,
          category: backend.category?.name || "",
          price: backend.price ?? 0,
          stock: backend.quantity ?? backend.stock ?? 0,
          status:
            backend.status === "active"
              ? "ACTIVE"
              : backend.status === "archived"
              ? "INACTIVE"
              : backend.status === "draft"
              ? "DRAFT"
              : backend.status || "DRAFT",
          sku: backend.sku,
          brand: backend.brand?.name || "",
          image:
            backend.thumbnail ||
            backend.imageUrl ||
            (Array.isArray(backend.images) && backend.images.length > 0
              ? typeof backend.images[0] === "string"
                ? backend.images[0]
                : backend.images[0]?.url
              : ""),
          description: backend.description || "",
          categoryId: backend.category?._id || backend.category?.id || "",
          brandId: backend.brand?._id || backend.brand?.id || "",
          images: Array.isArray(backend.images)
            ? backend.images.map((img: any) =>
                typeof img === "string" ? img : img.url
              )
            : [],
          createdAt: backend.createdAt,
          updatedAt: backend.updatedAt,
        };

        setProducts((prev) => (mapped.id ? [mapped, ...prev] : prev));
        // Re-fetch list to ensure consistency
        try {
          await fetchProducts();
        } catch (e) {
          console.warn("Soft refresh after create failed", e);
        }
        setCreating(false);
      } else {
        let errorMessage = "Failed to create product";
        try {
          const errorText = await response.text();
          let errorData: any = {};
          try {
            errorData = errorText ? JSON.parse(errorText) : {};
          } catch {
            errorData = { message: errorText };
          }
          if (errorData?.errors?.length) {
            errorMessage = errorData.errors
              .map((e: any) => `${e.field}: ${e.message}`)
              .join("; ");
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast.error("Không thể tạo sản phẩm");
      console.error("Error creating product:", error);
    } finally {
      setSaving(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.set("q", searchTerm);
      if (categoryFilter !== "all") params.set("categoryId", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", String(currentPage - 1));
      params.set("size", String(productsPerPage));

      console.log("Fetching products with params:", params.toString());

      const res = await fetch(`/api/products/admin?${params.toString()}`, {
        cache: "no-store",
      });

      console.log("Products response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Products response data:", data);

        const list = Array.isArray(data?.data) ? data.data : [];
        setProducts(
          list.map((p: any) => ({
            id: p.id || p._id,
            name: p.name || p.productName || "",
            category: p.categoryName || p.category?.name || "",
            price: p.price || p.basePrice || 0,
            stock: p.stock || p.quantity || p.inventoryQuantity || 0,
            status:
              p.status === "active"
                ? "ACTIVE"
                : p.status === "archived"
                ? "INACTIVE"
                : p.status === "draft"
                ? "DRAFT"
                : p.status || "ACTIVE",
            sku: p.sku || p.code || "",
            brand: p.brandName || p.brand?.name || "",
            image:
              p.thumbnail ||
              p.imageUrl ||
              (Array.isArray(p.images) && p.images.length > 0
                ? typeof p.images[0] === "string"
                  ? p.images[0]
                  : p.images[0]?.url
                : ""),
            description: p.description || "",
            categoryId:
              p.categoryId ||
              p.category?._id ||
              p.category?.id ||
              p.category ||
              "",
            brandId: p.brandId || p.brand?._id || p.brand?.id || p.brand || "",
            images: p.images || [],
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }))
        );
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch products:", errorData);

        // Handle different types of errors
        let errorMessage = "Không thể tải danh sách sản phẩm";

        if (errorData.error) {
          if (errorData.error.includes("Validation failed")) {
            errorMessage = "Lỗi validation dữ liệu từ backend";
          } else if (errorData.error.includes("Unauthorized")) {
            errorMessage = "Không có quyền truy cập. Vui lòng đăng nhập lại";
          } else if (errorData.error.includes("Not Found")) {
            errorMessage = "API endpoint không tồn tại";
          } else {
            errorMessage = errorData.error;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (res.status === 401) {
          errorMessage = "Không có quyền truy cập. Vui lòng đăng nhập lại";
        } else if (res.status === 404) {
          errorMessage = "API endpoint không tồn tại";
        } else if (res.status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau";
        } else {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching products:", error);
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  // Fetch categories and brands when component mounts
  useEffect(() => {
    console.log("Component mounted, fetching categories and brands...");
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    // Brands state changed
  }, [brands]);

  // Add retry mechanism with delay
  const retryWithDelay = (fn: () => void, delay: number = 2000) => {
    setTimeout(() => {
      console.log(`Retrying ${fn.name} after ${delay}ms delay...`);
      fn();
    }, delay);
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log("Fetching categories from backend...");

      // Try public proxy first; fallback to meta proxy
      let res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) {
        console.warn("/api/categories failed with status", res.status);
        res = await fetch("/api/meta/categories", { cache: "no-store" });
      }

      if (res.ok) {
        const responseData = await res.json();
        console.log("Categories response:", responseData);

        let categoriesList: any[] = [];
        // Handle the new response structure with success, data, pagination
        if (responseData?.success && Array.isArray(responseData.data)) {
          categoriesList = responseData.data;
        } else if (Array.isArray(responseData)) {
          categoriesList = responseData;
        } else if (responseData && Array.isArray(responseData?.data?.data)) {
          // Some gateways wrap twice { data: { data: [...] } }
          categoriesList = responseData.data.data;
        } else if (Array.isArray(responseData?.data)) {
          // Some proxies return { data: [...] } without success flag
          categoriesList = responseData.data;
        } else if (
          responseData?.success &&
          responseData?.data &&
          typeof responseData.data === "object"
        ) {
          // Backend returns object with numeric keys, convert to array
          categoriesList = Object.values(responseData.data);
        } else if (
          responseData?.data &&
          typeof responseData.data === "object" &&
          !Array.isArray(responseData.data)
        ) {
          // Handle object format directly
          categoriesList = Object.values(responseData.data);
        }

        // Map to expected format
        const mappedCategories = categoriesList.map((cat: any) => ({
          id: String(cat._id || cat.id || ""),
          name: cat.name || cat.categoryName || "Unknown Category",
        }));

        console.log("Raw categories from backend:", categoriesList);
        console.log("Mapped categories:", mappedCategories);
        console.log("Sample category ID format:", mappedCategories[0]?.id);
        console.log(
          "Sample category ID length:",
          mappedCategories[0]?.id?.length
        );
        console.log("Sample category ID type:", typeof mappedCategories[0]?.id);
        if (mappedCategories.length === 0) {
          console.warn("No categories found, using fallback data");
          // Don't set fallback categories - they cause backend validation errors
          console.warn(
            "No categories found from backend - product creation will require valid category"
          );
          // Set empty array to avoid undefined errors
          setCategories([]);
        } else {
          console.log(
            `✅ Successfully loaded ${mappedCategories.length} categories`
          );
          setCategories(mappedCategories);
        }
      } else {
        console.error("Failed to fetch categories, status:", res.status);
        const errorText = await res.text().catch(() => "Unknown error");
        console.error("Categories error response:", errorText);

        // Try to retry after delay
        if (res.status >= 500) {
          console.log("Server error, will retry in 2 seconds...");
          retryWithDelay(fetchCategories, 2000);
        }

        // Don't set fallback categories - they cause backend validation errors
        console.warn(
          "No categories found from backend - product creation will require valid category"
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Don't set fallback categories - they cause backend validation errors
      console.warn(
        "No categories found from backend - product creation will require valid category"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // Helper function to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Function to create a new category
  const createNewCategory = async (categoryName: string) => {
    try {
      const slug = generateSlug(categoryName);
      console.log(`Creating category: ${categoryName} -> slug: ${slug}`);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          name: categoryName,
          slug: slug,
          description: `Category created for: ${categoryName}`,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Refresh categories list
        await fetchCategories();

        return result.data?._id || result.data?.id;
      } else {
        // Try to get detailed error message from response
        let errorMessage = "Failed to create category";
        try {
          const errorData = await response.json();
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((e: any) => `${e.field}: ${e.message}`)
              .join("; ");
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If can't parse JSON, use status text
          errorMessage = response.statusText || "Failed to create category";
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tạo danh mục mới";
      toast.error(errorMessage);
      console.error("Error creating category:", error);
      return null;
    }
  };

  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      console.log("Fetching brands from backend...");

      // Try to fetch from real backend first
      const res = await fetch("/api/meta/brands", {
        cache: "no-store",
      });

      if (res.ok) {
        const responseData = await res.json();
        console.log("Brands response:", responseData);

        // Check if response has the expected structure
        if (responseData.success && Array.isArray(responseData.data)) {
          const brandsList = responseData.data;
          console.log("Brands data:", brandsList);
          console.log("Brands count:", brandsList.length);

          // Map to expected format - use _id as id and name as name
          const mappedBrands = brandsList.map((brand: any) => {
            const brandId = brand._id || brand.id;
            const brandName = brand.name;
            console.log(`Mapping brand: ${brandName} (${brandId})`);
            return {
              id: brandId,
              name: brandName,
            };
          });

          console.log("Mapped brands:", mappedBrands);
          setBrands(mappedBrands);
        } else {
          console.warn("Unexpected brands response structure:", responseData);
          // Don't set fallback brands - they cause backend validation errors
          console.warn(
            "No brands found from backend - product creation will require valid brand"
          );
        }
      } else {
        console.error("Failed to fetch brands, status:", res.status);
        const errorText = await res.text().catch(() => "Unknown error");
        console.error("Brands error response:", errorText);

        // Try to retry after delay
        if (res.status >= 500) {
          console.log("Server error, will retry in 2 seconds...");
          retryWithDelay(fetchBrands, 2000);
        }

        // Don't set fallback brands - they cause backend validation errors
        console.warn(
          "No brands found from backend - product creation will require valid brand"
        );
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      // Don't set fallback brands - they cause backend validation errors
      console.warn(
        "No brands found from backend - product creation will require valid brand"
      );
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const stsRes = await fetch(`/api/products/statuses`, {
          cache: "no-store",
        });

        let sts: any = [];
        if (stsRes.ok) {
          const t = await stsRes.text();
          const d = t ? JSON.parse(t) : null;
          sts = d?.data || d || [];
        }

        setStatuses(sts);
      } catch (error) {
        console.error("Error loading statuses:", error);
        setStatuses(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]);
      }
    };
    loadFilters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader
          isLoading={true}
          message="Đang tải danh sách sản phẩm..."
          size="lg"
          overlay={false}
        />
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === "all" || product.categoryId === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "OUT_OF_STOCK":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      case "OUT_OF_STOCK":
        return "bg-yellow-100 text-yellow-800";
      case "DISCONTINUED":
        return "bg-gray-100 text-gray-800";
      case "DRAFT":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock < 10) return "secondary";
    return "default";
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Quản lý danh mục sản phẩm và kho hàng
          </p>
        </div>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm, SKU, thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue
                    placeholder={loadingCategories ? "Đang tải..." : "Danh mục"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Đang tải danh mục...
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "ACTIVE"
                        ? "Hoạt động"
                        : status === "INACTIVE"
                        ? "Ngừng kinh doanh"
                        : status === "OUT_OF_STOCK"
                        ? "Hết hàng"
                        : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Package className="h-5 w-5 text-blue-600" />
            Danh sách sản phẩm ({filteredProducts.length})
            {loading && (
              <div className="ml-2">
                <Loader isLoading={true} size="sm" />
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            // Loading skeletons
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: productsPerPage }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-white">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse flex-1"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {product.brand}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </div>

                    {/* Stock and Status */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={getStockBadgeVariant(product.stock) as any}
                        className={`text-xs ${getStockBadgeColor(
                          product.stock
                        )}`}
                      >
                        {product.stock === 0
                          ? "Hết hàng"
                          : `${product.stock} cái`}
                      </Badge>
                      <Badge
                        variant={getStatusBadgeVariant(product.status) as any}
                        className={`text-xs ${getStatusBadgeColor(
                          product.status
                        )}`}
                      >
                        {product.status === "ACTIVE"
                          ? "Hoạt động"
                          : product.status === "INACTIVE"
                          ? "Ngừng kinh doanh"
                          : product.status === "OUT_OF_STOCK"
                          ? "Hết hàng"
                          : product.status}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
                        onClick={() => handleView(product.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all"
                        onClick={() => handleEdit(product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? (
                          <Loader isLoading={true} size="sm" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {error
                ? "Không thể tải danh sách sản phẩm"
                : "Không tìm thấy sản phẩm nào"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {(currentPage - 1) * productsPerPage + 1} đến{" "}
            {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
            trong tổng số {filteredProducts.length} sản phẩm
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                currentPage * productsPerPage >= filteredProducts.length
              }
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      {creating && (
        <ProductModal
          isOpen={creating}
          onClose={() => setCreating(false)}
          mode="create"
          onSave={handleCreate}
          categories={categories}
          brands={brands}
          onCreateCategory={createNewCategory}
        />
      )}

      {editing && (
        <ProductModal
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          product={editing}
          mode="edit"
          onSave={handleSaveEdit}
          categories={categories}
          brands={brands}
          onCreateCategory={createNewCategory}
        />
      )}

      {viewing && (
        <ProductViewModal
          isOpen={!!viewing}
          onClose={() => setViewing(null)}
          product={viewing}
          onEdit={() => {
            setViewing(null);
            handleEdit(viewing.id);
          }}
          onDelete={() => {
            setViewing(null);
            handleDelete(viewing.id);
          }}
        />
      )}
    </div>
  );
}
