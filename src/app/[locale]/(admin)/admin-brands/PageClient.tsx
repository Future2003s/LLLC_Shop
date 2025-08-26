"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const BrandModal = dynamic(() => import("./components/BrandModal"), {
  ssr: false,
});

export type Brand = {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
};
// Helper: validate URL only if provided
const isValidUrl = (s?: string) => {
  if (!s) return true;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
};

// Helper: build payload without empty optional fields
const buildBrandPayload = (p: Partial<Brand>) => {
  const out: any = {
    name: p.name?.trim() || "",
    isActive: p.isActive !== false,
  };
  if (typeof p.sortOrder === "number") out.sortOrder = p.sortOrder;
  const add = (key: keyof Brand) => {
    const val = (p as any)[key];
    if (typeof val === "string") {
      const v = val.trim();
      if (v) out[key] = v;
    }
  };
  add("description");
  add("logo");
  add("website");
  add("metaTitle");
  add("metaDescription");
  add("metaKeywords");
  return out;
};

const normalizeList = (data: any): Brand[] => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const normalizePagination = (data: any) => {
  const p = data?.pagination || data?.page || {};
  return {
    totalElements: Number(p.totalElements ?? p.total ?? 0),
    totalPages: Number(p.totalPages ?? p.pages ?? 1),
    page: Number(p.page ?? p.number ?? 1),
    size: Number(p.size ?? p.limit ?? 20),
  };
};

export default function PageClient() {
  // Table state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const isEditing = !!editing;

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all")
        params.set(
          "includeInactive",
          statusFilter === "inactive" ? "true" : "false"
        );
      // Admin API expects page starting at 0; our UI starts 1
      params.set("page", String(currentPage - 1));
      params.set("limit", String(pageSize));

      const res = await fetch(`/api/brands/admin?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const list = normalizeList(data);
      const p = normalizePagination(data);
      setBrands(
        list.map((b: any) => ({
          id: String(b._id || b.id),
          name: b.name,
          description: b.description || "",
          slug: b.slug || "",
          logo: b.logo || b.image || "",
          website: b.website || "",
          isActive: b.isActive !== false,
          sortOrder: b.sortOrder ?? b.order ?? 1,
          metaTitle: b.metaTitle || "",
          metaDescription: b.metaDescription || "",
          metaKeywords: b.metaKeywords || "",
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        }))
      );
      setTotalPages(p.totalPages || 1);
      setTotalCount(p.totalElements || list.length);
    } catch (e: any) {
      console.error("Failed to load brands:", e);
      setError(e?.message || "Không thể tải thương hiệu");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm, statusFilter]);

  // Actions
  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (brand: Brand) => {
    setEditing(brand);
    setModalOpen(true);
  };

  const createBrand = async (payload: Partial<Brand>) => {
    // Build payload without empty optional fields to avoid backend validation failures
    const body = buildBrandPayload(payload);
    const res = await fetch("/api/brands/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const created = data?.data || data;
    return created as Brand;
  };

  const updateBrand = async (id: string, payload: Partial<Brand>) => {
    const body = buildBrandPayload(payload);
    const res = await fetch(`/api/brands/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data?.data || data;
  };

  const deleteBrand = async (id: string) => {
    const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }
  };

  const onSave = async (form: any) => {
    try {
      if (isEditing && editing) {
        await updateBrand(editing.id, form);
        setBrands((prev) =>
          prev.map((b) => (b.id === editing.id ? { ...b, ...form } : b))
        );
        toast.success("Cập nhật thương hiệu thành công!");
      } else {
        const created = await createBrand(form);
        const mapped: Brand = {
          id: String((created as any)._id || (created as any).id),
          name: (created as any).name,
          description: (created as any).description || "",
          slug: (created as any).slug || "",
          logo: (created as any).logo || "",
          website: (created as any).website || "",
          isActive: (created as any).isActive !== false,
          sortOrder: (created as any).sortOrder ?? 1,
          metaTitle: (created as any).metaTitle || "",
          metaDescription: (created as any).metaDescription || "",
          metaKeywords: (created as any).metaKeywords || "",
          createdAt: (created as any).createdAt,
          updatedAt: (created as any).updatedAt,
        };
        setBrands((prev) => [mapped, ...prev]);
        toast.success("Tạo thương hiệu thành công!");
      }
      setModalOpen(false);
      setEditing(null);
      // Soft refresh to keep pagination counts accurate
      try {
        await fetchBrands();
      } catch {}
    } catch (e: any) {
      console.error("Save brand failed:", e);
      toast.error(e?.message || "Không thể lưu thương hiệu");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) return;
    try {
      await deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      toast.success("Đã xóa thương hiệu");
      try {
        await fetchBrands();
      } catch {}
    } catch (e: any) {
      console.error("Delete brand failed:", e);
      toast.error(e?.message || "Không thể xóa thương hiệu");
    }
  };

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const matchesSearch =
        !searchTerm || b.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? b.isActive : !b.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [brands, searchTerm, statusFilter]);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Thương hiệu
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo, sửa, xóa và tìm kiếm thương hiệu
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Thêm thương hiệu
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 h-11">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Danh sách thương hiệu ({filteredBrands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded border border-red-200 text-red-700 bg-red-50">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader isLoading={true} size="lg" overlay={false} />
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="border rounded-lg p-4 bg-white hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {brand.name}
                        </h3>
                        <Badge
                          className={
                            brand.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {brand.isActive ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {brand.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => onDelete(brand.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                    >
                      {brand.website}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có thương hiệu nào
            </div>
          )}

          {/* Pagination */}
          {filteredBrands.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Trang {currentPage} / {totalPages} — Tổng {totalCount}
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {modalOpen && (
        <BrandModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          mode={isEditing ? "edit" : "create"}
          brand={editing || undefined}
          onSave={onSave}
        />
      )}
    </div>
  );
}
