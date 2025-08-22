"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit, Trash2, MoreHorizontal, Eye, Copy, Globe } from "lucide-react";
import { TranslationData } from "@/apiRequests/translations";
import { useTranslations } from "@/hooks/useTranslations";

interface TranslationListProps {
  translations: TranslationData[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onEdit: (translation: TranslationData) => void;
  onDelete: (key: string) => Promise<boolean>;
  onPageChange: (page: number) => void;
}

export function TranslationList({
  translations,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}: TranslationListProps) {
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const handleDelete = async (key: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bản dịch này?")) {
      setDeletingKey(key);
      try {
        await onDelete(key);
      } finally {
        setDeletingKey(null);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Có thể thêm toast notification ở đây
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      product: "Sản phẩm",
      category: "Danh mục",
      brand: "Thương hiệu",
      ui: "Giao diện",
      error: "Lỗi",
      success: "Thành công",
      validation: "Xác thực",
      email: "Email",
      notification: "Thông báo",
    };
    return categoryMap[category] || category;
  };

  const getLanguageFlag = (lang: string) => {
    const flagMap: Record<string, string> = {
      vi: "🇻🇳",
      en: "🇺🇸",
      ja: "🇯🇵",
    };
    return flagMap[lang] || lang;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (translations.length === 0) {
    return (
      <div className="text-center py-8">
        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Không có bản dịch nào</h3>
        <p className="text-muted-foreground">
          Hãy thêm bản dịch đầu tiên để bắt đầu quản lý đa ngôn ngữ.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Translations Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Bản dịch</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {translations.map((translation) => (
              <TableRow key={translation.key}>
                <TableCell>
                  <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {translation.key}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getCategoryLabel(translation.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {Object.entries(translation.translations).map(
                      ([lang, text]) => (
                        <div key={lang} className="flex items-center gap-2">
                          <span className="text-lg">
                            {getLanguageFlag(lang)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {text.length > 50
                              ? `${text.substring(0, 50)}...`
                              : text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(text)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={translation.isActive ? "default" : "secondary"}
                  >
                    {translation.isActive ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(translation)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(translation.key)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Sao chép key
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(translation.key)}
                        disabled={deletingKey === translation.key}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingKey === translation.key
                          ? "Đang xóa..."
                          : "Xóa"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            trong tổng số {pagination.total} bản dịch
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(pagination.page - 1)}
                  className={
                    pagination.page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const page =
                    Math.max(
                      1,
                      Math.min(pagination.totalPages - 4, pagination.page - 2)
                    ) + i;
                  if (page > pagination.totalPages) return null;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === pagination.page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(pagination.page + 1)}
                  className={
                    pagination.page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
