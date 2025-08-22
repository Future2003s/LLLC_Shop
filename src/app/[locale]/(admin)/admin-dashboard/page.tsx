"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";

interface DashboardStats {
  products: {
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
  };
  categories: {
    total: number;
    active: number;
    inactive: number;
  };
  brands: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: { total: 0, active: 0, inactive: 0, outOfStock: 0 },
    categories: { total: 0, active: 0, inactive: 0 },
    brands: { total: 0, active: 0, inactive: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products stats
      const productsRes = await fetch("/api/products/admin?page=0&size=1000", {
        cache: "no-store",
      });

      // Fetch categories stats
      const categoriesRes = await fetch(
        "/api/categories/admin?page=0&limit=1000",
        {
          cache: "no-store",
        }
      );

      // Fetch brands stats
      const brandsRes = await fetch("/api/brands/admin?page=0&limit=1000", {
        cache: "no-store",
      });

      let productsData: any[] = [];
      let categoriesData: any[] = [];
      let brandsData: any[] = [];

      if (productsRes.ok) {
        const productsResult = await productsRes.json();
        productsData = productsResult.data || [];
      }

      if (categoriesRes.ok) {
        const categoriesResult = await categoriesRes.json();
        categoriesData = categoriesResult.data || [];
      }

      if (brandsRes.ok) {
        const brandsResult = await brandsRes.json();
        brandsData = brandsResult.data || [];
      }

      // Calculate stats
      const newStats: DashboardStats = {
        products: {
          total: productsData.length,
          active: productsData.filter((p) => p.status === "ACTIVE").length,
          inactive: productsData.filter((p) => p.status === "INACTIVE").length,
          outOfStock: productsData.filter((p) => p.status === "OUT_OF_STOCK")
            .length,
        },
        categories: {
          total: categoriesData.length,
          active: categoriesData.filter((c) => c.isActive).length,
          inactive: categoriesData.filter((c) => !c.isActive).length,
        },
        brands: {
          total: brandsData.length,
          active: brandsData.filter((b) => b.isActive).length,
          inactive: brandsData.filter((b) => !b.isActive).length,
        },
      };

      setStats(newStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Không thể tải thống kê dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Loader className="w-8 h-8 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải thống kê...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Quản lý tổng quan hệ thống sản phẩm
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <Button
              onClick={fetchDashboardStats}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng sản phẩm
              </CardTitle>
              <Badge variant="secondary">{stats.products.total}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products.total}</div>
              <div className="text-xs text-muted-foreground mt-2">
                <div className="flex justify-between">
                  <span>Hoạt động: {stats.products.active}</span>
                  <span>Không hoạt động: {stats.products.inactive}</span>
                </div>
                <div className="mt-1">
                  <span>Hết hàng: {stats.products.outOfStock}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng danh mục
              </CardTitle>
              <Badge variant="secondary">{stats.categories.total}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories.total}</div>
              <div className="text-xs text-muted-foreground mt-2">
                <div className="flex justify-between">
                  <span>Hoạt động: {stats.categories.active}</span>
                  <span>Không hoạt động: {stats.categories.inactive}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng thương hiệu
              </CardTitle>
              <Badge variant="secondary">{stats.brands.total}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.brands.total}</div>
              <div className="text-xs text-muted-foreground mt-2">
                <div className="flex justify-between">
                  <span>Hoạt động: {stats.brands.active}</span>
                  <span>Không hoạt động: {stats.brands.inactive}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quản lý Sản phẩm</span>
                <Badge variant="outline">{stats.products.total}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sản phẩm hoạt động:</span>
                  <Badge variant="secondary">{stats.products.active}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sản phẩm không hoạt động:</span>
                  <Badge variant="secondary">{stats.products.inactive}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sản phẩm hết hàng:</span>
                  <Badge variant="destructive">
                    {stats.products.outOfStock}
                  </Badge>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/vi/admin/products">
                  <Button className="w-full">Quản lý Sản phẩm</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quản lý Danh mục</span>
                <Badge variant="outline">{stats.categories.total}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Danh mục hoạt động:</span>
                  <Badge variant="secondary">{stats.categories.active}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Danh mục không hoạt động:</span>
                  <Badge variant="secondary">{stats.categories.inactive}</Badge>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/vi/admin/categories">
                  <Button className="w-full">Quản lý Danh mục</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Brands Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quản lý Thương hiệu</span>
                <Badge variant="outline">{stats.brands.total}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Thương hiệu hoạt động:</span>
                  <Badge variant="secondary">{stats.brands.active}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thương hiệu không hoạt động:</span>
                  <Badge variant="secondary">{stats.brands.inactive}</Badge>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/vi/admin/brands">
                  <Button className="w-full">Quản lý Thương hiệu</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/vi/admin/products">
                  <Button variant="outline" className="w-full">
                    + Thêm Sản phẩm
                  </Button>
                </Link>
                <Link href="/vi/admin/categories">
                  <Button variant="outline" className="w-full">
                    + Thêm Danh mục
                  </Button>
                </Link>
                <Link href="/vi/admin/brands">
                  <Button variant="outline" className="w-full">
                    + Thêm Thương hiệu
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={fetchDashboardStats}
                >
                  🔄 Làm mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái Hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>API Products: Hoạt động</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>API Categories: Hoạt động</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>API Brands: Hoạt động</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
