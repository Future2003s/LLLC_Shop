"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Bell,
  Globe,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { useSearchParams, useRouter } from "next/navigation";
import { OrdersView } from "./components/OrdersView";
import { useOrders } from "./hooks/useOrders";

type RevenuePoint = { date: string; revenue: number };

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const section = searchParams?.get("section") || "dashboard";
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    pagination,
    updateOrder,
    goToPage,
    changePageSize,
  } = useOrders();
  const [summary, setSummary] = useState<any>(null);
  const [revenueSeries, setRevenueSeries] = useState<RevenuePoint[]>([]);
  type RangeKey = "7d" | "30d" | "month";
  type ChartPoint = { date: string; revenue?: number; orders?: number };

  const [ordersSeries, setOrdersSeries] = useState<RevenuePoint[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [range, setRange] = useState<RangeKey>("30d");
  const [chartColor, setChartColor] = useState<string>("#16a34a"); // green-600
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [stacked, setStacked] = useState<boolean>(false);

  const [revenueLoading, setRevenueLoading] = useState<boolean>(true);

  const formatCurrency = (v: any) =>
    typeof v === "number"
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(v)
      : v ?? "₫0";

  const extractRevenueSeries = (s: any): RevenuePoint[] => {
    if (!s) return [];
    const candidates = [
      s?.revenueTrend,
      s?.dailyRevenue,
      s?.revenueByDay,
      s?.chart?.revenue,
      s?.last7DaysRevenue,
    ].find((arr) => Array.isArray(arr)) as any[] | undefined;

    if (Array.isArray(candidates)) {
      return candidates
        .map((it: any) => {
          const date = it.date || it.day || it.label || it.name;
          const value = it.value ?? it.revenue ?? it.amount ?? it.total ?? 0;
          return {
            date: String(date),
            revenue: Number(value) || 0,
          } as RevenuePoint;
        })
        .filter((d: RevenuePoint) => !!d.date);
    }
    return [];
  };

  const extractOrdersSeries = (s: any): RevenuePoint[] => {
    if (!s) return [];
    const candidates = [
      s?.ordersTrend,
      s?.dailyOrders,
      s?.ordersByDay,
      s?.chart?.orders,
      s?.last7DaysOrders,
    ].find((arr) => Array.isArray(arr)) as any[] | undefined;

    if (Array.isArray(candidates)) {
      return candidates
        .map((it: any) => {
          const date = it.date || it.day || it.label || it.name;
          const value = it.value ?? it.orders ?? it.count ?? it.total ?? 0;
          return {
            date: String(date),
            revenue: Number(value) || 0,
          } as RevenuePoint;
        })
        .filter((d: RevenuePoint) => !!d.date);
    }
    return [];
  };

  const buildChartData = (
    rev: RevenuePoint[],
    ord: RevenuePoint[]
  ): ChartPoint[] => {
    const map = new Map<string, ChartPoint>();
    for (const r of rev) {
      map.set(r.date, { date: r.date, revenue: r.revenue });
    }
    for (const o of ord) {
      const existing = map.get(o.date) || { date: o.date };
      map.set(o.date, { ...existing, orders: o.revenue });
    }
    return Array.from(map.values());
  };

  // Load chart data when range changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setRevenueLoading(true);
        const url = new URL(`/api/analytics/summary`, window.location.origin);
        url.searchParams.set("range", range);
        const res = await fetch(url.toString(), { cache: "no-store" });
        const text = await res.text();
        const json = text ? JSON.parse(text) : null;
        const s = json?.data || json;
        if (cancelled) return;
        setSummary(s);
        const rev = extractRevenueSeries(s);
        const ord = extractOrdersSeries(s);
        setRevenueSeries(rev);
        setOrdersSeries(ord);
        setChartData(buildChartData(rev, ord));
      } catch (e) {
        if (cancelled) return;
        setSummary(null);
        setRevenueSeries([]);
        setOrdersSeries([]);
        setChartData([]);
      } finally {
        if (!cancelled) setRevenueLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [range]);

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const Content = useMemo(() => {
    if (section === "orders") {
      return (
        <OrdersView
          orders={orders}
          loading={ordersLoading}
          error={ordersError}
          pagination={pagination}
          onUpdateOrder={updateOrder}
          onGoToPage={goToPage}
          onChangePageSize={changePageSize}
        />
      );
    }
    return null;
  }, [section, orders, ordersLoading, ordersError, pagination]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader
          isLoading={true}
          message="Đang tải dashboard..."
          size="lg"
          overlay={false}
        />
      </div>
    );
  }

  const onNavigate = (nextSection: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("section", nextSection);
    router.push(url.pathname + "?" + url.searchParams.toString());
  };
  const localePrefix = (path: string) => {
    const parts = window.location.pathname.split("/");
    const locale = parts[1] || "vi";
    return `/${locale}/admin${path}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Thông báo
          </Button>
          <Badge variant="outline">Admin</Badge>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng đơn hàng
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary?.monthRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                +15.3% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+8 sản phẩm mới</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                +12.5% so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Phạm vi:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={range}
              onChange={(e) => setRange(e.target.value as RangeKey)}
            >
              <option value="7d">7 ngày</option>
              <option value="30d">30 ngày</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Màu cột:</span>
            <input
              type="color"
              value={chartColor}
              onChange={(e) => setChartColor(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            Hiển thị nhãn
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stacked}
              onChange={(e) => setStacked(e.target.checked)}
            />
            Stacked bar
          </label>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Tổng doanh thu (xu hướng)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader isLoading={true} message="Đang tải biểu đồ..." />
              </div>
            ) : revenueSeries.length > 0 ? (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueSeries}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(v) =>
                        new Intl.NumberFormat("vi-VN").format(v as any)
                      }
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        new Intl.NumberFormat("vi-VN", {
                          style: stacked ? "decimal" : "currency",
                          currency: "VND",
                        }).format(Number(value) || 0),
                        "Doanh thu",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Doanh thu"
                      fill={chartColor}
                      stackId={stacked ? "a" : undefined}
                    >
                      {showLabels && (
                        <LabelList
                          dataKey="revenue"
                          position="top"
                          formatter={(v: any) =>
                            new Intl.NumberFormat("vi-VN").format(
                              Number(v) || 0
                            )
                          }
                        />
                      )}
                    </Bar>
                    {stacked && (
                      <Bar
                        dataKey="orders"
                        name="Đơn hàng"
                        fill="#3b82f6"
                        stackId="a"
                      >
                        {showLabels && (
                          <LabelList
                            dataKey="orders"
                            position="top"
                            formatter={(v: any) =>
                              new Intl.NumberFormat("vi-VN").format(
                                Number(v) || 0
                              )
                            }
                          />
                        )}
                      </Bar>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Chưa có dữ liệu doanh thu để hiển thị
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tình trạng hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Máy chủ</span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Hoạt động
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cơ sở dữ liệu</span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Hoạt động
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bảo mật</span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Bảo mật
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sao lưu</span>
                  <Badge variant="outline">2 giờ trước</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Đăng nhập mới từ Admin</span>
                  <span className="text-gray-500 ml-auto">2 phút trước</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Đơn hàng mới #1234</span>
                  <span className="text-gray-500 ml-auto">15 phút trước</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Cập nhật sản phẩm</span>
                  <span className="text-gray-500 ml-auto">1 giờ trước</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Sao lưu hệ thống</span>
                  <span className="text-gray-500 ml-auto">2 giờ trước</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => onNavigate("orders")}
              >
                <ShoppingCart className="h-4 w-4" />
                Quản lý đơn hàng
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  (window.location.href = localePrefix("/products"))
                }
              >
                <Package className="h-4 w-4" />
                Quản lý sản phẩm
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Quản lý khách hàng
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Báo cáo chi tiết
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  (window.location.href = localePrefix("/translations"))
                }
              >
                <Globe className="h-4 w-4" />
                Quản lý đa ngôn ngữ
              </Button>
            </div>
          </CardContent>
        </Card>
        {Content}
      </div>
    </div>
  );
}
