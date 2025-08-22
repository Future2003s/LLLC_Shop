"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Trash2,
} from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { TranslationData } from "@/apiRequests/translations";

export function TranslationImportExport() {
  const { exportTranslations, bulkImport } = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [importData, setImportData] = useState<string>("");
  const [importPreview, setImportPreview] = useState<TranslationData[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "all", label: "Tất cả danh mục" },
    { value: "product", label: "Sản phẩm" },
    { value: "category", label: "Danh mục" },
    { value: "brand", label: "Thương hiệu" },
    { value: "ui", label: "Giao diện" },
    { value: "error", label: "Lỗi" },
    { value: "success", label: "Thành công" },
    { value: "validation", label: "Xác thực" },
    { value: "email", label: "Email" },
    { value: "notification", label: "Thông báo" },
  ];

  const languages = [
    { value: "all", label: "Tất cả ngôn ngữ" },
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "English" },
    { value: "ja", label: "日本語" },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportTranslations(
        selectedCategory === "all" ? undefined : selectedCategory,
        selectedLanguage === "all" ? undefined : selectedLanguage
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
      validateImportData(content);
    };
    reader.readAsText(file);
  };

  const handleImportDataChange = (value: string) => {
    setImportData(value);
    validateImportData(value);
  };

  const validateImportData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      const errors: string[] = [];
      const preview: TranslationData[] = [];

      if (Array.isArray(parsed)) {
        parsed.forEach((item, index) => {
          if (!item.key) {
            errors.push(`Item ${index + 1}: Thiếu key`);
          } else if (!item.translations) {
            errors.push(`Item ${index + 1}: Thiếu translations`);
          } else if (
            !item.translations.vi ||
            !item.translations.en ||
            !item.translations.ja
          ) {
            errors.push(
              `Item ${index + 1}: Thiếu bản dịch cho một hoặc nhiều ngôn ngữ`
            );
          } else {
            preview.push(item);
          }
        });
      } else if (typeof parsed === "object") {
        // Single translation object
        if (!parsed.key) {
          errors.push("Thiếu key");
        } else if (!parsed.translations) {
          errors.push("Thiếu translations");
        } else if (
          !parsed.translations.vi ||
          !parsed.translations.en ||
          !parsed.translations.ja
        ) {
          errors.push("Thiếu bản dịch cho một hoặc nhiều ngôn ngữ");
        } else {
          preview.push(parsed);
        }
      } else {
        errors.push("Dữ liệu không hợp lệ");
      }

      setImportErrors(errors);
      setImportPreview(preview);
    } catch (error) {
      setImportErrors(["Dữ liệu JSON không hợp lệ"]);
      setImportPreview([]);
    }
  };

  const handleImport = async () => {
    if (importPreview.length === 0 || importErrors.length > 0) return;

    setIsImporting(true);
    try {
      const success = await bulkImport(importPreview);
      if (success) {
        setImportData("");
        setImportPreview([]);
        setImportErrors([]);
        // Có thể thêm toast notification thành công
      }
    } finally {
      setIsImporting(false);
    }
  };

  const clearImport = () => {
    setImportData("");
    setImportPreview([]);
    setImportErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePreviewItem = (index: number) => {
    setImportPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Xuất bản dịch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ngôn ngữ</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Đang xuất..." : "Xuất bản dịch"}
          </Button>

          <div className="text-xs text-muted-foreground">
            <p>• Để trống để xuất tất cả danh mục và ngôn ngữ</p>
            <p>• File sẽ được tải về dưới dạng JSON</p>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Nhập bản dịch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Tải file JSON</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="cursor-pointer w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Manual Input */}
          <div className="space-y-2">
            <Label>Hoặc nhập trực tiếp JSON</Label>
            <Textarea
              value={importData}
              onChange={(e) => handleImportDataChange(e.target.value)}
              placeholder='[{"key": "example.key", "category": "ui", "translations": {"vi": "Ví dụ", "en": "Example", "ja": "例"}}]'
              rows={4}
            />
          </div>

          {/* Preview and Validation */}
          {importPreview.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Xem trước ({importPreview.length} bản dịch)
              </Label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {importPreview.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.key}</div>
                      <div className="text-muted-foreground">
                        {item.category} •{" "}
                        {Object.values(item.translations).join(" • ")}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreviewItem(index)}
                      className="h-6 w-6 p-0 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {importErrors.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                Lỗi ({importErrors.length})
              </Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {importErrors.map((error, index) => (
                  <div
                    key={index}
                    className="text-sm text-red-600 bg-red-50 p-2 rounded"
                  >
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={
                isImporting ||
                importPreview.length === 0 ||
                importErrors.length > 0
              }
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Đang nhập..." : "Nhập bản dịch"}
            </Button>
            <Button
              onClick={clearImport}
              variant="outline"
              disabled={!importData && importPreview.length === 0}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>• Hỗ trợ file JSON hoặc nhập trực tiếp</p>
            <p>
              • Mỗi bản dịch cần có key, category và translations cho tất cả
              ngôn ngữ
            </p>
            <p>• Bản dịch trùng key sẽ được cập nhật</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
