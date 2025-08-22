"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/settings/homepage`, {
          cache: "no-store",
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        const hp = data?.data || data || {};
        setTitle(hp.title || "");
        setSubtitle(hp.subtitle || "");
        setBanner(hp.bannerUrl || null);
      } catch {}
    };
    load();
  }, []);

  const saveText = async () => {
    try {
      const res = await fetch(`/api/settings/homepage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle }),
      });
      if (!res.ok) throw new Error();
      toast.success("Đã lưu nội dung trang chủ");
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  const uploadBanner = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`/api/settings/homepage/banner`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) throw new Error();
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      setBanner(data?.data?.url || data?.url || null);
      toast.success("Đã cập nhật banner");
    } catch {
      toast.error("Cập nhật banner thất bại");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Cài đặt trang chủ</h1>
      <Card>
        <CardHeader>
          <CardTitle>Nội dung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tiêu đề</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Phụ đề</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <Button onClick={saveText}>Lưu</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {banner ? (
            <img
              src={banner}
              alt="banner"
              className="w-full max-w-2xl rounded-md"
            />
          ) : (
            <div className="w-full max-w-xl h-40 bg-gray-100 rounded-md flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-gray-400" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button onClick={uploadBanner} disabled={!file}>
            Tải lên
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
