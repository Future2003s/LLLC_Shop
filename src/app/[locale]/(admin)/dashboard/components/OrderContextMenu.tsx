"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Edit,
  Eye,
  History,
  Copy,
  Printer,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Truck,
  Package,
} from "lucide-react";
import type { Order } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderContextMenuProps {
  order: Order;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onEdit: (order: Order) => void;
  onView: (order: Order) => void;
  onHistory: (orderId: string) => void;
  onQuickStatusUpdate: (orderId: string, newStatus: string) => void;
}

export const OrderContextMenu = ({
  order,
  position,
  onClose,
  onEdit,
  onView,
  onHistory,
  onQuickStatusUpdate,
}: OrderContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!position) return null;

  const handleQuickStatusUpdate = async (newStatus: string) => {
    try {
      await onQuickStatusUpdate(order.id, newStatus);
      onClose();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const copyOrderInfo = () => {
    const orderInfo = `Mã ĐH: ${order.id}\nKhách hàng: ${order.customerName}\nTổng tiền: ${order.total}\nTrạng thái: ${order.status}`;
    navigator.clipboard.writeText(orderInfo);
    onClose();
  };

  const printOrder = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Đơn hàng ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-info { margin-bottom: 20px; }
              .items { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Đơn hàng ${order.id}</h1>
              <p>Ngày: ${new Date(order.date).toLocaleDateString("vi-VN")}</p>
            </div>
            <div class="order-info">
              <h3>Thông tin khách hàng</h3>
              <p><strong>Khách hàng:</strong> ${order.customerName}</p>
              <p><strong>Tổng tiền:</strong> ${order.total}</p>
              <p><strong>Trạng thái:</strong> ${order.status}</p>
            </div>
            <div class="items">
              <h3>Danh sách sản phẩm</h3>
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    onClose();
  };

  const downloadOrderPDF = () => {
    // Simple PDF generation using browser print
    printOrder();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-48"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="font-medium text-gray-900">Đơn hàng {order.id}</div>
        <div className="text-sm text-gray-500">{order.customerName}</div>
      </div>

      {/* Quick Actions */}
      <div className="px-2 py-1">
        <div className="text-xs font-medium text-gray-500 px-2 py-1">
          Thao tác nhanh
        </div>

        {/* Quick Status Updates */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-green-600 hover:bg-green-50"
            onClick={() => handleQuickStatusUpdate("processing")}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Xác nhận xử lý
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-blue-600 hover:bg-blue-50"
            onClick={() => handleQuickStatusUpdate("shipped")}
          >
            <Truck className="w-4 h-4 mr-2" />
            Đang giao hàng
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-purple-600 hover:bg-purple-50"
            onClick={() => handleQuickStatusUpdate("delivered")}
          >
            <Package className="w-4 h-4 mr-2" />
            Đã giao hàng
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={() => handleQuickStatusUpdate("cancelled")}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Hủy đơn hàng
          </Button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-2 py-1">
        <div className="text-xs font-medium text-gray-500 px-2 py-1">
          Thao tác chính
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => onView(order)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Xem chi tiết
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => onEdit(order)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Cập nhật trạng thái
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => onHistory(order.id)}
        >
          <History className="w-4 h-4 mr-2" />
          Lịch sử chỉnh sửa
        </Button>
      </div>

      {/* Utility Actions */}
      <div className="px-2 py-1">
        <div className="text-xs font-medium text-gray-500 px-2 py-1">
          Tiện ích
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={copyOrderInfo}
        >
          <Copy className="w-4 h-4 mr-2" />
          Sao chép thông tin
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={printOrder}
        >
          <Printer className="w-4 h-4 mr-2" />
          In đơn hàng
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={downloadOrderPDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Tải PDF
        </Button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="text-xs text-gray-400">Nhấn ESC để đóng</div>
      </div>
    </div>
  );
};
