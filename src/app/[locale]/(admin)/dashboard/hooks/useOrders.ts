"use client";
import { useEffect, useState } from "react";
import type { Order } from "../types";

interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  });
  const fetchOrders = async (page = 1, size = 10) => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching orders:", { page, size });
      console.log(
        "🌐 API URL:",
        `/api/orders/admin/all?page=${page}&size=${size}`
      );

      const res = await fetch(
        `/api/orders/admin/all?page=${page}&size=${size}`,
        {
          credentials: "include", // Use cookies instead of Authorization header
          cache: "no-store",
        }
      );

      console.log("📊 Orders API response status:", res.status);
      console.log(
        "📋 Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Orders API error:", errorText);

        if (res.status === 401) {
          throw new Error("Vui lòng đăng nhập để xem đơn hàng");
        } else if (res.status === 403) {
          throw new Error("Bạn không có quyền xem đơn hàng");
        } else if (res.status === 404) {
          throw new Error("API endpoint không tồn tại");
        } else if (res.status === 500) {
          throw new Error("Lỗi server - vui lòng thử lại sau");
        } else {
          throw new Error(`Lỗi tải đơn hàng: ${res.status} - ${errorText}`);
        }
      }

      let payload;
      try {
        const text = await res.text();
        console.log("📄 Raw response:", text);
        payload = text ? JSON.parse(text) : null;
        console.log("📦 Parsed payload:", payload);
      } catch (error) {
        console.error("JSON parse error:", error);
        payload = null;
      }
      const data = payload?.data || payload;
      console.log("📊 Final data:", data);

      // Extract pagination info
      console.log("📊 Extracting pagination info from:", data);
      const paginationInfo: PaginationInfo = {
        page: data.page || 1,
        size: data.size || 10,
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        first: data.first || true,
        last: data.last || false,
      };
      console.log("📋 Pagination info:", paginationInfo);

      const list: any[] = data.content || data || [];
      console.log("📦 Raw orders list:", list);
      console.log("📊 Orders count:", list.length);

      const mapped: Order[] = list.map((o: any) => {
        console.log("🔄 Mapping order:", o);
        return {
          id: o.id || o._id || o.orderNumber || "N/A",
          customerName:
            o.customerFullName ||
            o.customerName ||
            o.customer?.fullName ||
            "Khách hàng",
          date: o.createdAt || o.date || new Date().toISOString(),
          total: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(o.amount || o.total || 0)),
          status:
            o.status === "pending"
              ? "Chờ xử lý"
              : o.status === "processing"
              ? "Đang xử lý"
              : o.status === "shipped"
              ? "Đang giao"
              : o.status === "delivered"
              ? "Đã giao"
              : o.status === "cancelled"
              ? "Đã huỷ"
              : "Chờ xử lý",
          items: Array.isArray(o.items)
            ? o.items.map((it: any) => ({
                id: it.id || it._id || "N/A",
                name: it.productName || it.name || "Sản phẩm",
                quantity: it.quantity || 0,
                price: new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(it.price || 0)),
              }))
            : [],
        };
      });

      console.log("✅ Mapped orders:", mapped);

      setOrders(mapped);
      setPagination(paginationInfo);
      console.log("🎉 Orders loaded successfully!");
      console.log("📊 Final orders count:", mapped.length);
      console.log("📋 Final pagination:", paginationInfo);
    } catch (err) {
      console.error("💥 Error in fetchOrders:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      console.log("🏁 fetchOrders completed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Remove sessionToken dependency

  const updateOrder = (updatedOrder: Order) => {
    // Update the order in the list with new status
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );

    // Show success message
    console.log("Order updated successfully:", updatedOrder);
  };

  const goToPage = (page: number) => {
    fetchOrders(page, pagination.size);
  };

  const changePageSize = (size: number) => {
    fetchOrders(1, size);
  };

  const refreshOrders = () => {
    fetchOrders(pagination.page, pagination.size);
  };

  return {
    orders,
    loading,
    error,
    pagination,
    updateOrder,
    refreshOrders,
    goToPage,
    changePageSize,
  };
};
