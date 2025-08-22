"use client";
import type { Order } from "../types";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const OrderViewModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  if (!order) {
    return (
      <div
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 space-y-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Đã giao":
        return "success" as const;
      case "Đã huỷ":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Chi tiết Đơn hàng
              </h2>
              <p className="text-gray-500">Mã ĐH: {order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700">
                Thông tin khách hàng
              </h3>
              <p className="text-gray-600">{order.customerName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Ngày đặt</h3>
              <p className="text-gray-600">{order.date}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Trạng thái</h3>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Tổng tiền</h3>
              <p className="text-gray-800 font-bold">{order.total}</p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold text-gray-700 mb-4">Các sản phẩm</h3>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-600">{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
