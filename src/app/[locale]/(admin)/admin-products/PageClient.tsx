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
import dynamic from "next/dynamic";
import Image from "next/image";
const ProductModal = dynamic(() => import("./components/ProductModal"), {
  ssr: false,
});
const ProductViewModal = dynamic(
  () => import("./components/ProductViewModal"),
  { ssr: false }
);
import { productApiRequest } from "@/apiRequests/products";
import { useAppContextProvider } from "@/context/app-context";

export default function PageClient() {
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

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [viewing, setViewing] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { sessionToken } = useAppContextProvider();

  // Map backend product object to UI shape
  const mapBackendToUI = (backend: any, fallback?: any) => {
    return {
      id: backend._id || backend.id || fallback?.id,
      name: backend.name || fallback?.name,
      category:
        typeof backend.category === "string"
          ? fallback?.category
          : backend.category?.name || fallback?.category,
      price: backend.price ?? fallback?.price ?? 0,
      stock: backend.quantity ?? fallback?.stock ?? 0,
      status:
        backend.status === "active"
          ? "ACTIVE"
          : backend.status === "archived"
          ? "INACTIVE"
          : backend.status === "draft"
          ? "DRAFT"
          : fallback?.status || "DRAFT",
      sku: backend.sku ?? fallback?.sku,
      brand:
        typeof backend.brand === "string"
          ? fallback?.brand
          : backend.brand?.name || fallback?.brand,
      image:
        backend.images && backend.images.length > 0
          ? typeof backend.images[0] === "string"
            ? backend.images[0]
            : backend.images[0]?.url
          : fallback?.image,
      description: backend.description ?? fallback?.description,
      categoryId:
        typeof backend.category === "string"
          ? backend.category
          : backend.category?._id || fallback?.categoryId,
      brandId:
        typeof backend.brand === "string"
          ? backend.brand
          : backend.brand?._id || fallback?.brandId,
      images: Array.isArray(backend.images)
        ? backend.images.map((img: any) =>
            typeof img === "string" ? img : img.url
          )
        : fallback?.images || [],
      createdAt: backend.createdAt ?? fallback?.createdAt,
      updatedAt: backend.updatedAt ?? new Date().toISOString(),
    };
  };

  // Handler functions (copied from original page)
  const handleUpdate = async (productData: any) => {
    try {
      setSaving(true);
      const response = await productApiRequest.updateProduct(
        sessionToken || "",
        editing?.id || "",
        productData
      );
      if (response.success) {
        const backend = response.data as any;
        const mapped = mapBackendToUI(backend, editing);
        setProducts((prev) =>
          prev.map((p) => (p.id === editing?.id ? { ...p, ...mapped } : p))
        );
        setEditing(null);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Không thể cập nhật sản phẩm");
      console.error("Error updating product:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleView = async (productId: string) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product) setViewing(product);
    } catch (error) {
      toast.error("Không thể tải chi tiết sản phẩm");
    }
  };

  const handleEdit = async (productId: string) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product) setEditing(product);
    } catch (error) {
      toast.error("Không thể tải thông tin sản phẩm");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      setDeletingId(productId);
      const response = await productApiRequest.deleteProduct(
        sessionToken || "",
        productId
      );
      if (response.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        if (viewing?.id === productId) setViewing(null);
        if (editing?.id === productId) setEditing(null);
        toast.success("Đã xóa sản phẩm thành công!");
      } else {
        toast.error(response.message || "Không thể xóa sản phẩm");
      }
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (updatedProduct: any) => {
    try {
      setSaving(true);
      const response = await productApiRequest.updateProduct(
        sessionToken || "",
        editing.id,
        updatedProduct
      );
      if (response.success) {
        const backend = response.data;
        const mapped = mapBackendToUI(backend, editing);
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...mapped } : p))
        );
        setEditing(null);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        toast.error(response.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Không thể cập nhật sản phẩm");
    } finally {
      setSaving(false);
    }
  };
  const handleCreate = async (productData: any) => {
    try {
      setSaving(true);
      const response = await productApiRequest.createProduct(
        sessionToken || "",
        productData
      );
      if (response.success) {
        const backend = response.data;
        const mapped = mapBackendToUI(backend, null);
        setProducts((prev) => (mapped.id ? [mapped, ...prev] : prev));
        try {
          await fetchProducts();
        } catch {}
        setCreating(false);
        toast.success("Đã tạo sản phẩm mới thành công!");
      } else {
        const errorMessage = response.message || "Failed to create product";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Không thể tạo sản phẩm");
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
      params.set("page", String(currentPage));
      params.set("size", String(productsPerPage));
      const res = await fetch(`/api/products/admin?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        const pagination = data?.pagination || {};
        setTotalCount(Number(pagination.totalElements || 0));
        setTotalPages(Number(pagination.totalPages || 1));
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
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (error: any) {
      setError(error?.message || "Unknown error occurred");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  // Retry helper
  const retryWithDelay = (fn: () => void, delay: number = 2000) => {
    setTimeout(() => {
      fn();
    }, delay);
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

  // Categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      // Try public proxy first; fallback to meta proxy
      let res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) {
        res = await fetch("/api/meta/categories", { cache: "no-store" });
      }
      if (res.ok) {
        const responseData = await res.json();
        let categoriesList: any[] = [];
        if (responseData?.success && Array.isArray(responseData.data)) {
          categoriesList = responseData.data;
        } else if (Array.isArray(responseData)) {
          categoriesList = responseData;
        } else if (responseData && Array.isArray(responseData?.data?.data)) {
          categoriesList = responseData.data.data;
        } else if (Array.isArray(responseData?.data)) {
          categoriesList = responseData.data;
        } else if (
          responseData?.success &&
          responseData?.data &&
          typeof responseData.data === "object"
        ) {
          categoriesList = Object.values(responseData.data);
        } else if (
          responseData?.data &&
          typeof responseData.data === "object" &&
          !Array.isArray(responseData.data)
        ) {
          categoriesList = Object.values(responseData.data);
        }
        const mappedCategories = categoriesList.map((cat: any) => ({
          id: String(cat._id || cat.id || ""),
          name: cat.name || cat.categoryName || "Unknown Category",
        }));
        setCategories(mappedCategories);
      } else {
        if (res.status >= 500) retryWithDelay(fetchCategories, 2000);
      }
    } catch (error) {
      // keep categories empty
    } finally {
      setLoadingCategories(false);
    }
  };

  // Create new category
  const createNewCategory = async (categoryName: string) => {
    try {
      const slug = generateSlug(categoryName);
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          name: categoryName,
          slug,
          description: `Category created for: ${categoryName}`,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        await fetchCategories();
        return result.data?._id || result.data?.id;
      } else {
        let errorMessage = "Failed to create category";
        try {
          const errorData = await response.json();
          if (Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((e: any) => `${e.field}: ${e.message}`)
              .join("; ");
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {}
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      const msg = error?.message || "Không thể tạo danh mục mới";
      toast.error(msg);
      return null;
    }
  };

  // Brands
  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const res = await fetch("/api/meta/brands", { cache: "no-store" });
      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && Array.isArray(responseData.data)) {
          const mapped = responseData.data.map((brand: any) => ({
            id: String(brand._id || brand.id || ""),
            name: brand.name,
          }));
          setBrands(mapped);
        }
      } else {
        if (res.status >= 500) retryWithDelay(fetchBrands, 2000);
      }
    } catch (error) {
      // ignore
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

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
      } catch {
        setStatuses(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]);
      }
    };
    loadFilters();
  }, []);
  // Load categories & brands when opening create modal
  // Ensure categories/brands are loaded on mount (covers Edit modal case)
  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (brands.length === 0) fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Also ensure data is available when opening Edit modal
  useEffect(() => {
    if (editing) {
      if (categories.length === 0) fetchCategories();
      if (brands.length === 0) fetchBrands();
    }
  }, [editing]);

  useEffect(() => {
    if (creating) {
      if (categories.length === 0) fetchCategories();
      if (brands.length === 0) fetchBrands();
    }
  }, [creating]);

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
          <Plus className="h-4 w-4" /> Thêm sản phẩm mới
        </Button>
      </div>
      {/* Filters and Search */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm, SKU, thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                <SelectTrigger className="w-full sm:w-40 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" /> Lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Products Grid */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Package className="h-5 w-5 text-blue-600" /> Danh sách sản phẩm (
            {filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white"
              >
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
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={getStockBadgeVariant(product.stock) as any}
                      className={`text-xs ${getStockBadgeColor(product.stock)}`}
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
                      {product.status}
                    </Badge>
                  </div>
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
          {filteredProducts.length === 0 && (
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
            {Math.min(currentPage * productsPerPage, totalCount)} trong tổng số{" "}
            {totalCount} sản phẩm
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
          onSave={handleUpdate}
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
