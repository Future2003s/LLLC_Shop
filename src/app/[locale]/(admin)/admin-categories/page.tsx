"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/ui/loader";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    sortOrder: 1,
    parentId: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(20);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all")
        params.set("isActive", statusFilter === "active" ? "true" : "false");
      params.set("page", String(currentPage - 1));
      params.set("limit", String(categoriesPerPage));

      console.log("Fetching categories with params:", params.toString());

      const res = await fetch(`/api/categories/admin?${params.toString()}`, {
        cache: "no-store",
      });

      console.log("Categories response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Categories response data:", data);

        const list = Array.isArray(data?.data) ? data.data : [];
        setCategories(list);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch categories:", errorData);
        throw new Error(errorData.message || "Failed to fetch categories");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching categories:", error);
      setError(errorMessage);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
      sortOrder: 1,
      parentId: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    });
  };

  const handleCreate = async () => {
    try {
      setCreating(true);
      setError(null);

      // Validation
      if (!formData.name.trim()) {
        setError("Tên danh mục là bắt buộc");
        return;
      }

      // Build payload without sending empty optional fields
      const categoryData: Record<string, any> = {
        name: formData.name.trim(),
        isActive: formData.isActive,
        sortOrder: formData.sortOrder,
      };
      if (formData.description.trim())
        categoryData.description = formData.description.trim();
      if (formData.metaTitle.trim())
        categoryData.metaTitle = formData.metaTitle.trim();
      if (formData.metaDescription.trim())
        categoryData.metaDescription = formData.metaDescription.trim();
      if (formData.metaKeywords.trim())
        categoryData.metaKeywords = formData.metaKeywords.trim();
      if (formData.parentId) categoryData.parentId = formData.parentId;

      console.log("Creating category:", categoryData);

      const response = await fetch("/api/categories/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Create category response:", result);

        const newCategory = result.data;
        setCategories((prev) => [newCategory, ...prev]);
        setCreating(false);
        resetForm();
        toast.success("Đã tạo danh mục thành công");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editing) return;

    try {
      setCreating(true);
      setError(null);

      // Validation
      if (!formData.name.trim()) {
        setError("Tên danh mục là bắt buộc");
        return;
      }

      // Build payload without sending empty optional fields
      const categoryData: Record<string, any> = {
        name: formData.name.trim(),
        isActive: formData.isActive,
        sortOrder: formData.sortOrder,
      };
      if (formData.description.trim())
        categoryData.description = formData.description.trim();
      if (formData.metaTitle.trim())
        categoryData.metaTitle = formData.metaTitle.trim();
      if (formData.metaDescription.trim())
        categoryData.metaDescription = formData.metaDescription.trim();
      if (formData.metaKeywords.trim())
        categoryData.metaKeywords = formData.metaKeywords.trim();
      if (formData.parentId) categoryData.parentId = formData.parentId;

      console.log("Updating category:", editing.id, categoryData);

      const response = await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update category response:", result);

        setCategories((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...categoryData } : c))
        );
        setEditing(null);
        resetForm();
        toast.success("Đã cập nhật danh mục thành công");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update category"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      setDeletingId(categoryId);
      setError(null);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
        toast.success("Đã xóa danh mục thành công");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentId: category.parentId || "",
      metaTitle: category.metaTitle || "",
      metaDescription: category.metaDescription || "",
      metaKeywords: category.metaKeywords || "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    resetForm();
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, statusFilter]);

  const filteredCategories = categories.filter((category) => {
    if (
      searchTerm &&
      !category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter === "active" && !category.isActive) {
      return false;
    }
    if (statusFilter === "inactive" && category.isActive) {
      return false;
    }
    return true;
  });

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quản lý Danh mục
          </h1>
          <p className="text-lg text-gray-600">
            Quản lý danh mục sản phẩm và thông tin SEO
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {loading ? <Loader className="w-5 h-5" /> : null}
                  Danh sách Danh mục
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Tìm kiếm danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredCategories.length > 0 ? (
                  <div className="space-y-4">
                    {filteredCategories.map((category) => (
                      <div
                        key={category.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {category.name}
                              </h3>
                              <Badge
                                className={getStatusBadgeColor(
                                  category.isActive
                                )}
                              >
                                {category.isActive
                                  ? "Hoạt động"
                                  : "Không hoạt động"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {category.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                              <div>
                                <span className="font-medium">Slug:</span>{" "}
                                {category.slug}
                              </div>
                              <div>
                                <span className="font-medium">Thứ tự:</span>{" "}
                                {category.sortOrder}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Danh mục cha:
                                </span>
                                {category.parentId ? " Có" : " Không"}
                              </div>
                              <div>
                                <span className="font-medium">Cập nhật:</span>
                                {category.updatedAt
                                  ? new Date(
                                      category.updatedAt
                                    ).toLocaleDateString("vi-VN")
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              onClick={() => startEdit(category)}
                              variant="outline"
                              size="sm"
                            >
                              Sửa
                            </Button>
                            <Button
                              onClick={() => handleDelete(category.id)}
                              variant="destructive"
                              size="sm"
                              disabled={deletingId === category.id}
                            >
                              {deletingId === category.id
                                ? "Đang xóa..."
                                : "Xóa"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Không tìm thấy danh mục nào</p>
                    <p className="text-sm mt-2">
                      {searchTerm || statusFilter !== "all"
                        ? "Thử thay đổi bộ lọc tìm kiếm"
                        : "Tạo danh mục đầu tiên để bắt đầu"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Create/Edit Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editing ? "Sửa Danh mục" : "Tạo Danh mục mới"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editing ? handleEdit() : handleCreate();
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Tên danh mục *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nhập tên danh mục"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Mô tả danh mục"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sortOrder">Thứ tự</Label>
                        <Input
                          id="sortOrder"
                          type="number"
                          value={formData.sortOrder}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sortOrder: parseInt(e.target.value) || 1,
                            })
                          }
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parentId">Danh mục cha</Label>
                        <Input
                          id="parentId"
                          value={formData.parentId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parentId: e.target.value,
                            })
                          }
                          placeholder="ID danh mục cha (tùy chọn)"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            isActive: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="isActive">Danh mục hoạt động</Label>
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaTitle: e.target.value,
                          })
                        }
                        placeholder="Tiêu đề SEO (để trống sẽ dùng tên danh mục)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaDescription: e.target.value,
                          })
                        }
                        placeholder="Mô tả SEO (để trống sẽ dùng mô tả danh mục)"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="metaKeywords">Meta Keywords</Label>
                      <Input
                        id="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaKeywords: e.target.value,
                          })
                        }
                        placeholder="Từ khóa SEO (phân cách bằng dấu phẩy)"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      {editing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                          className="flex-1"
                        >
                          Hủy
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={creating || !formData.name.trim()}
                        className="flex-1"
                      >
                        {creating
                          ? "Đang lưu..."
                          : editing
                          ? "Cập nhật"
                          : "Tạo mới"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
