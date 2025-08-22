import { http } from "@/lib/http";
import { API_CONFIG } from "@/lib/api-config";

// Order types based on backend model
export interface OrderItem {
  product:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
        sku: string;
        images: string[];
      };
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentInfo {
  method: "cod" | "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  status: "pending" | "paid" | "failed" | "refunded";
  transactionId?: string;
  paidAt?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentInfo: PaymentInfo;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  trackingNumber?: string;
  notes?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrdersResponse {
  success: boolean;
  message?: string;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: PaymentInfo["method"];
  notes?: string;
  couponCode?: string;
}

export interface OrderTrackingResponse {
  success: boolean;
  message?: string;
  data: {
    orderNumber: string;
    status: Order["status"];
    trackingNumber?: string;
    estimatedDelivery?: string;
    trackingHistory: Array<{
      status: string;
      description: string;
      location?: string;
      timestamp: string;
    }>;
  };
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: Order["status"];
  startDate?: string;
  endDate?: string;
  sort?: "createdAt" | "total" | "status";
  order?: "asc" | "desc";
}

// Order API requests
export const orderApiRequest = {
  // Get user orders
  getUserOrders: (
    token: string,
    params?: OrderQueryParams
  ): Promise<OrdersResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return http.get(
      `${API_CONFIG.ORDERS.USER_ORDERS}${queryString ? `?${queryString}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get single order
  getOrder: (token: string, orderId: string): Promise<OrderResponse> => {
    return http.get(API_CONFIG.ORDERS.BY_ID.replace(":id", orderId), {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Create order
  createOrder: (
    token: string,
    orderData: CreateOrderData
  ): Promise<OrderResponse> => {
    return http.post(API_CONFIG.ORDERS.CREATE, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Cancel order
  cancelOrder: (
    token: string,
    orderId: string,
    reason?: string
  ): Promise<OrderResponse> => {
    return http.put(
      API_CONFIG.ORDERS.CANCEL.replace(":id", orderId),
      { reason },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get order tracking
  getOrderTracking: (
    token: string,
    orderId: string
  ): Promise<OrderTrackingResponse> => {
    return http.get(API_CONFIG.ORDERS.TRACKING.replace(":id", orderId), {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin: Get all orders
  getAllOrders: (
    token: string,
    params?: OrderQueryParams
  ): Promise<OrdersResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return http.get(
      `${API_CONFIG.ORDERS.ALL}${queryString ? `?${queryString}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Admin: Update order status
  updateOrderStatus: (
    token: string,
    orderId: string,
    status: Order["status"],
    notes?: string
  ): Promise<OrderResponse> => {
    return http.put(
      API_CONFIG.ORDERS.UPDATE_STATUS.replace(":id", orderId),
      { status, notes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Admin: Update tracking number
  updateTrackingNumber: (
    token: string,
    orderId: string,
    trackingNumber: string
  ): Promise<OrderResponse> => {
    return http.put(
      `/orders/${orderId}/tracking`,
      { trackingNumber },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};

// Helper function to get order status label
export function getOrderStatusLabel(status: Order["status"]): string {
  const labels: Record<Order["status"], string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đã gửi hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
  };
  return labels[status] || status;
}

// Helper function to get order status color
export function getOrderStatusColor(status: Order["status"]): string {
  const colors: Record<Order["status"], string> = {
    pending: "yellow",
    processing: "blue",
    shipped: "indigo",
    delivered: "green",
    cancelled: "red",
    refunded: "gray",
  };
  return colors[status] || "gray";
}

// Helper function to get payment method label
export function getPaymentMethodLabel(method: PaymentInfo["method"]): string {
  const labels: Record<PaymentInfo["method"], string> = {
    cod: "Thanh toán khi nhận hàng",
    credit_card: "Thẻ tín dụng",
    debit_card: "Thẻ ghi nợ",
    paypal: "PayPal",
    bank_transfer: "Chuyển khoản ngân hàng",
  };
  return labels[method] || method;
}

// Helper function to get payment status label
export function getPaymentStatusLabel(status: PaymentInfo["status"]): string {
  const labels: Record<PaymentInfo["status"], string> = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    failed: "Thanh toán thất bại",
    refunded: "Đã hoàn tiền",
  };
  return labels[status] || status;
}

// Helper function to format order date
export function formatOrderDate(date: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Helper function to calculate order summary
export function calculateOrderSummary(items: OrderItem[]): {
  itemCount: number;
  subtotal: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  return { itemCount, subtotal };
}

// Helper function to check if order can be cancelled
export function canCancelOrder(order: Order): boolean {
  return ["pending", "processing"].includes(order.status);
}

// Helper function to check if order can be refunded
export function canRefundOrder(order: Order): boolean {
  return order.status === "delivered" && order.paymentInfo.status === "paid";
}
