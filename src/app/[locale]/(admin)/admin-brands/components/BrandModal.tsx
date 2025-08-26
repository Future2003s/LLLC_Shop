"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "@/components/ui/loader";
import { X, Save } from "lucide-react";
import type { Brand } from "../PageClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  brand?: Brand;
  onSave: (payload: Partial<Brand>) => Promise<void>;
}

export default function BrandModal({
  isOpen,
  onClose,
  mode,
  brand,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Brand>>({
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

  useEffect(() => {
    if (brand && mode === "edit") {
      setForm({
        name: brand.name || "",
        description: brand.description || "",
        logo: brand.logo || "",
        website: brand.website || "",
        isActive: brand.isActive,
        sortOrder: brand.sortOrder || 1,
        metaTitle: brand.metaTitle || "",
        metaDescription: brand.metaDescription || "",
        metaKeywords: brand.metaKeywords || "",
      });
    } else {
      setForm({
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
    }
  }, [brand, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.name.trim()) return;
    // Validate only if values provided
    const urlLike = [form.logo, form.website].filter(Boolean) as string[];
    for (const u of urlLike) {
      try {
        new URL(u);
      } catch {
        alert("Logo/Website phải là URL hợp lệ (nếu nhập)");
        return;
      }
    }
    try {
      setLoading(true);
      await onSave({
        name: form.name?.trim(),
        description: form.description?.trim() || undefined,
        logo: form.logo?.trim() || undefined,
        website: form.website?.trim() || undefined,
        isActive: !!form.isActive,
        sortOrder: form.sortOrder || 1,
        metaTitle: form.metaTitle?.trim() || undefined,
        metaDescription: form.metaDescription?.trim() || undefined,
        metaKeywords: form.metaKeywords?.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-full max-w-xl border-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {mode === "create" ? "Thêm thương hiệu" : "Sửa thương hiệu"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tên *</Label>
                <Input
                  id="name"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sortOrder">Thứ tự</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={form.sortOrder || 1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sortOrder: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={form.logo || ""}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={form.website || ""}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={!!form.isActive}
                onCheckedChange={(c) =>
                  setForm({ ...form, isActive: Boolean(c) })
                }
              />
              <Label htmlFor="isActive">Hoạt động</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={form.metaTitle || ""}
                  onChange={(e) =>
                    setForm({ ...form, metaTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={form.metaKeywords || ""}
                  onChange={(e) =>
                    setForm({ ...form, metaKeywords: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                rows={2}
                value={form.metaDescription || ""}
                onChange={(e) =>
                  setForm({ ...form, metaDescription: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader isLoading={true} size="sm" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Lưu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
