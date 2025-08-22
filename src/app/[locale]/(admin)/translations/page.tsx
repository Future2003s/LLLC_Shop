"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import {
  TranslationStats,
  TranslationList,
  TranslationForm,
  TranslationSearch,
  TranslationImportExport,
} from "@/components/admin/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw } from "lucide-react";

export default function TranslationsPage() {
  const {
    translations,
    loading,
    error,
    stats,
    pagination,
    fetchTranslations,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    clearError,
  } = useTranslations();

  const [showForm, setShowForm] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateNew = () => {
    setEditingTranslation(null);
    setShowForm(true);
  };

  const handleEdit = (translation: any) => {
    setEditingTranslation(translation);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    let success = false;

    if (editingTranslation) {
      success = await updateTranslation(editingTranslation.key, data);
    } else {
      success = await createTranslation(data);
    }

    if (success) {
      setShowForm(false);
      setEditingTranslation(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTranslation(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchTranslations(1, pagination.limit, category, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchTranslations(1, pagination.limit, selectedCategory, query);
  };

  const handlePageChange = (page: number) => {
    fetchTranslations(page, pagination.limit, selectedCategory, searchQuery);
  };

  const handleRefresh = () => {
    fetchTranslations(
      pagination.page,
      pagination.limit,
      selectedCategory,
      searchQuery
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Đa ngôn ngữ</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && <TranslationStats stats={stats} />}

      {/* Search and Filters */}
      <TranslationSearch
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      {/* Import/Export */}
      <TranslationImportExport />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Translation List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách bản dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <TranslationList
                translations={translations}
                loading={loading}
                pagination={pagination}
                onEdit={handleEdit}
                onDelete={deleteTranslation}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleCreateNew}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm bản dịch
              </Button>
              <Button
                onClick={() =>
                  fetchTranslations(1, 50, selectedCategory, searchQuery)
                }
                className="w-full"
                variant="outline"
              >
                Xem tất cả
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Translation Form Modal */}
      {showForm && (
        <TranslationForm
          translation={editingTranslation}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <Button
              onClick={clearError}
              variant="ghost"
              size="sm"
              className="text-white hover:text-white/80 ml-4"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
