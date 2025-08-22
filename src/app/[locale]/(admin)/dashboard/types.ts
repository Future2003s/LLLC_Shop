export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "Còn hàng" | "Sắp hết" | "Hết hàng";
  imageUrl: string;
  description: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: string;
  status: "Chờ xử lý" | "Đang xử lý" | "Đang giao" | "Đã giao" | "Đã huỷ";
  items: OrderItem[];
}
