"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/ui/loader";
import { X, Save, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  mode: "create" | "edit";
  onSave: (productData: any) => Promise<void>;
  categories: any[];
  brands: any[];
  onCreateCategory?: (categoryName: string) => Promise<string | null>;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  mode,
  onSave,
  categories,
  brands,
  onCreateCategory,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    categoryId: "",
    brandId: "",
    status: "draft", // use backend-aligned default
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const editing = mode === "edit";

  useEffect(() => {
    if (product && mode === "edit") {
      // Map incoming status to backend values: draft | active | archived
      const incomingStatus = (product.status || "draft")
        .toString()
        .toUpperCase();
      const mappedStatus =
        incomingStatus === "ACTIVE"
          ? "active"
          : incomingStatus === "INACTIVE"
          ? "archived"
          : incomingStatus === "DRAFT"
          ? "draft"
          : incomingStatus === "ACTIVE"
          ? "active"
          : incomingStatus === "ARCHIVED"
          ? "archived"
          : "draft"; // Always fallback to draft if unknown

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: (product.stock ?? product.quantity)?.toString() || "",
        sku: product.sku || "",
        categoryId: String(
          product.categoryId ||
            product.category?.id ||
            product.category?._id ||
            ""
        ),
        brandId: String(
          product.brandId || product.brand?.id || product.brand?._id || ""
        ),
        status: mappedStatus,
        images: Array.isArray(product.images)
          ? product.images.map((img: any) =>
              typeof img === "string" ? img : img.url
            )
          : [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        categoryId: "",
        brandId: "",
        status: "draft", // Always ensure valid default
        images: [],
      });
    }
  }, [product, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      setError("Tên sản phẩm là bắt buộc");
      return;
    }
    if (!formData.sku.trim()) {
      setError("SKU là bắt buộc");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Giá sản phẩm phải lớn hơn 0");
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError("Số lượng tồn kho không được âm");
      return;
    }
    // Require valid category selection
    const isValidObjectId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val);
    if (!formData.categoryId) {
      if (categories.length === 0) {
        setError(
          "Không có danh mục nào khả dụng. Vui lòng tạo danh mục trước khi tạo sản phẩm"
        );
      } else {
        setError("Vui lòng chọn danh mục sản phẩm");
      }
      return;
    }

    // Log category ID format warning (but don't block)
    if (!isValidObjectId(formData.categoryId)) {
      console.warn("Category ID format unusual:", formData.categoryId);
      console.warn("Will try to send anyway - backend may validate");
    }

    // Validate status is valid
    if (
      !formData.status ||
      !["draft", "active", "archived"].includes(formData.status)
    ) {
      setError("Trạng thái sản phẩm không hợp lệ");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Prepare data for backend
      const productData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.stock), // Changed from stock to quantity
        sku: formData.sku.trim(),
        // Ensure status is always valid and never empty
        status: formData.status || "draft",
      };

      // Debug category validation
      console.log("=== CATEGORY VALIDATION DEBUG ===");
      console.log("Selected categoryId:", formData.categoryId);
      console.log("Available categories:", categories);
      console.log("CategoryId type:", typeof formData.categoryId);
      console.log("CategoryId length:", formData.categoryId?.length);

      // Only include valid ObjectIds for category/brand (avoid test IDs)
      const isValidObjectId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val);

      if (formData.categoryId) {
        productData.category = formData.categoryId;
        if (isValidObjectId(formData.categoryId)) {
          console.log("✅ Category ID is valid ObjectId");
        } else {
          console.warn(
            "⚠️ Category ID format unusual, but proceeding:",
            formData.categoryId
          );
        }
      } else {
        console.log("⚠️ No category selected");
      }

      if (formData.brandId) {
        productData.brand = formData.brandId;
        if (isValidObjectId(formData.brandId)) {
          console.log("✅ Brand ID is valid ObjectId");
        } else {
          console.warn(
            "⚠️ Brand ID format unusual, but proceeding:",
            formData.brandId
          );
        }
      } else {
        console.log("⚠️ No brand selected");
      }

      if (formData.images && formData.images.length > 0) {
        productData.images = formData.images.map((url, index) => ({
          url: url,
          alt: `Product image ${index + 1}`,
          isMain: index === 0, // First image is main
          order: index,
        }));
      }

      console.log("Submitting product data:", productData);
      console.log("=== PRODUCT MODAL DEBUG ===");
      console.log("Form data state:", formData);
      console.log("Final payload:", productData);
      console.log("=== END MODAL DEBUG ===");

      if (editing) {
        // Update existing product
        // Ensure client does not pass protected fields accidentally
        const {
          createdBy,
          updatedBy,
          _id,
          id,
          publishedAt,
          createdAt,
          updatedAt,
          ...safeUpdate
        } = productData;
        await onSave(safeUpdate);
      } else {
        // Create new product
        await onSave(productData);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lưu sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-xl font-bold text-gray-800">
            {mode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-red-100 hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Tên sản phẩm *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên sản phẩm"
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="sku"
                  className="text-sm font-medium text-gray-700"
                >
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  placeholder="Nhập SKU"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Nhập mô tả sản phẩm"
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700"
                >
                  Giá *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="stock"
                  className="text-sm font-medium text-gray-700"
                >
                  Số lượng tồn kho *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stock: e.target.value }))
                  }
                  placeholder="0"
                  min="0"
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="categoryId"
                  className="text-sm font-medium text-gray-700"
                >
                  Danh mục *
                </Label>
                {categories.length === 0 ? (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                    <p>⚠️ Không có danh mục nào khả dụng</p>
                    <p className="text-xs mt-1">
                      Vui lòng tạo danh mục trước khi tạo sản phẩm
                    </p>
                    {onCreateCategory && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => {
                          setShowCreateCategory(true);
                          setNewCategoryName("");
                        }}
                      >
                        + Tạo danh mục mới
                      </Button>
                    )}
                  </div>
                ) : (
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="brandId"
                  className="text-sm font-medium text-gray-700"
                >
                  Thương hiệu
                </Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, brandId: value }))
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Trạng thái
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="archived">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Hình ảnh
              </Label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Nhập URL hình ảnh"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  onClick={addImage}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-20 object-cover rounded border border-gray-300"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-600"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-300 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader isLoading={true} size="sm" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {mode === "create" ? "Tạo sản phẩm" : "Cập nhật"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showCreateCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl font-bold text-gray-800">
                Tạo danh mục mới
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateCategory(false)}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newCategoryName.trim()) {
                    setCreatingCategory(true);
                    onCreateCategory?.(newCategoryName.trim())
                      .then((newCategoryId) => {
                        if (newCategoryId) {
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: newCategoryId,
                          }));
                          setShowCreateCategory(false);
                          setNewCategoryName("");
                        }
                      })
                      .catch((err) => {
                        toast.error(
                          err.message || "Có lỗi xảy ra khi tạo danh mục"
                        );
                      })
                      .finally(() => {
                        setCreatingCategory(false);
                      });
                  } else {
                    toast.error("Tên danh mục không được để trống");
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="newCategoryName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tên danh mục *
                  </Label>
                  <Input
                    id="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nhập tên danh mục mới"
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateCategory(false)}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={creatingCategory}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {creatingCategory ? (
                      <Loader isLoading={true} size="sm" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Tạo danh mục
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
