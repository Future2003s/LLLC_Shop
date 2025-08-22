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

interface Brand {
  id: string;
  name: string;
  description: string;
  slug: string;
  logo: string;
  website: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    isActive: true,
    sortOrder: 1,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage] = useState(20);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all")
        params.set("isActive", statusFilter === "active" ? "true" : "false");
      params.set("page", String(currentPage - 1));
      params.set("limit", String(brandsPerPage));

      console.log("Fetching brands with params:", params.toString());

      const res = await fetch(`/api/brands/admin?${params.toString()}`, {
        cache: "no-store",
      });

      console.log("Brands response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Brands response data:", data);

        const list = Array.isArray(data?.data) ? data.data : [];
        setBrands(list);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch brands:", errorData);
        throw new Error(errorData.message || "Failed to fetch brands");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching brands:", error);
      setError(errorMessage);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: "",
      website: "",
      isActive: true,
      sortOrder: 1,
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
        setError("Tên thương hiệu là bắt buộc");
        return;
      }

      const brandData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        logo: formData.logo.trim(),
        website: formData.website.trim(),
        metaTitle: formData.metaTitle.trim() || formData.name.trim(),
        metaDescription:
          formData.metaDescription.trim() || formData.description.trim(),
        metaKeywords: formData.metaKeywords.trim(),
      };

      console.log("Creating brand:", brandData);

      const response = await fetch("/api/brands/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Create brand response:", result);

        const newBrand = result.data;
        setBrands((prev) => [newBrand, ...prev]);
        setCreating(false);
        resetForm();
        toast.success("Đã tạo thương hiệu thành công");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create brand");
      }
    } catch (error) {
      console.error("Error creating brand:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create brand"
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
        setError("Tên thương hiệu là bắt buộc");
        return;
      }

      const brandData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        logo: formData.logo.trim(),
        website: formData.website.trim(),
        metaTitle: formData.metaTitle.trim() || formData.name.trim(),
        metaDescription:
          formData.metaDescription.trim() || formData.description.trim(),
        metaKeywords: formData.metaKeywords.trim(),
      };

      console.log("Updating brand:", editing.id, brandData);

      const response = await fetch(`/api/brands/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update brand response:", result);

        setBrands((prev) =>
          prev.map((b) => (b.id === editing.id ? { ...b, ...brandData } : b))
        );
        setEditing(null);
        resetForm();
        toast.success("Đã cập nhật thương hiệu thành công");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update brand");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update brand"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (brandId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      return;
    }

    try {
      setDeletingId(brandId);
      setError(null);

      const response = await fetch(`/api/brands/${brandId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== brandId));
        toast.success("Đã xóa thương hiệu thành công");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete brand"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (brand: Brand) => {
    setEditing(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
      website: brand.website,
      isActive: brand.isActive,
      sortOrder: brand.sortOrder,
      metaTitle: brand.metaTitle || "",
      metaDescription: brand.metaDescription || "",
      metaKeywords: brand.metaKeywords || "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    resetForm();
  };

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm, statusFilter]);

  const filteredBrands = brands.filter((brand) => {
    if (
      searchTerm &&
      !brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter === "active" && !brand.isActive) {
      return false;
    }
    if (statusFilter === "inactive" && brand.isActive) {
      return false;
    }
    return true;
  });

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quản lý Thương hiệu
          </h1>
          <p className="text-lg text-gray-600">
            Quản lý thương hiệu sản phẩm và thông tin SEO
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brands List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {loading ? <Loader className="w-5 h-5" /> : null}
                  Danh sách Thương hiệu
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Tìm kiếm thương hiệu..."
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
                ) : filteredBrands.length > 0 ? (
                  <div className="space-y-4">
                    {filteredBrands.map((brand) => (
                      <div
                        key={brand.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {brand.name}
                              </h3>
                              <Badge
                                className={getStatusBadgeColor(brand.isActive)}
                              >
                                {brand.isActive
                                  ? "Hoạt động"
                                  : "Không hoạt động"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {brand.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                              <div>
                                <span className="font-medium">Slug:</span>{" "}
                                {brand.slug}
                              </div>
                              <div>
                                <span className="font-medium">Thứ tự:</span>{" "}
                                {brand.sortOrder}
                              </div>
                              <div>
                                <span className="font-medium">Logo:</span>
                                {brand.logo ? " Có" : " Không"}
                              </div>
                              <div>
                                <span className="font-medium">Website:</span>
                                {brand.website ? " Có" : " Không"}
                              </div>
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
                          <div className="flex space-x-2 ml-4">
                            <Button
                              onClick={() => startEdit(brand)}
                              variant="outline"
                              size="sm"
                            >
                              Sửa
                            </Button>
                            <Button
                              onClick={() => handleDelete(brand.id)}
                              variant="destructive"
                              size="sm"
                              disabled={deletingId === brand.id}
                            >
                              {deletingId === brand.id ? "Đang xóa..." : "Xóa"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Không tìm thấy thương hiệu nào</p>
                    <p className="text-sm mt-2">
                      {searchTerm || statusFilter !== "all"
                        ? "Thử thay đổi bộ lọc tìm kiếm"
                        : "Tạo thương hiệu đầu tiên để bắt đầu"}
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
                  {editing ? "Sửa Thương hiệu" : "Tạo Thương hiệu mới"}
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
                      <Label htmlFor="name">Tên thương hiệu *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nhập tên thương hiệu"
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
                        placeholder="Mô tả thương hiệu"
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
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input
                          id="logo"
                          type="url"
                          value={formData.logo}
                          onChange={(e) =>
                            setFormData({ ...formData, logo: e.target.value })
                          }
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        placeholder="https://example.com"
                      />
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
                      <Label htmlFor="isActive">Thương hiệu hoạt động</Label>
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
                        placeholder="Tiêu đề SEO (để trống sẽ dùng tên thương hiệu)"
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
                        placeholder="Mô tả SEO (để trống sẽ dùng mô tả thương hiệu)"
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
