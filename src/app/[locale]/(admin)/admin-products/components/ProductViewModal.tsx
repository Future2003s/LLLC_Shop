"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Trash2 } from "lucide-react";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductViewModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}: ProductViewModalProps) {
  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case "INACTIVE":
        return (
          <Badge className="bg-gray-100 text-gray-800">Ngừng kinh doanh</Badge>
        );
      case "OUT_OF_STOCK":
        return <Badge className="bg-red-100 text-red-800">Hết hàng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-xl font-bold text-gray-800">
            Chi tiết sản phẩm
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Product Header */}
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">Không có hình ảnh</div>
                </div>
              )}
            </div>

            {/* Product Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    SKU
                  </label>
                  <p className="text-gray-900 font-medium">
                    {product.sku || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </label>
                  <div className="mt-1">{getStatusBadge(product.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Giá
                  </label>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price || 0)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tồn kho
                  </label>
                  <p className="text-gray-900 font-medium">
                    {product.stock || 0} cái
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Danh mục
                  </label>
                  <p className="text-gray-900 font-medium">
                    {product.category?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Thương hiệu
                  </label>
                  <p className="text-gray-900 font-medium">
                    {product.brand?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Hình ảnh sản phẩm
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Thông tin chi tiết
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">ID</span>
                  <span className="font-medium text-gray-900">
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ngày tạo</span>
                  <span className="font-medium text-gray-900">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ngày cập nhật</span>
                  <span className="font-medium text-gray-900">
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Thống kê
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Lượt xem</span>
                  <span className="font-medium text-gray-900">
                    {product.viewCount || 0}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Đã bán</span>
                  <span className="font-medium text-gray-900">
                    {product.soldCount || 0}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Đánh giá</span>
                  <span className="font-medium text-gray-900">
                    {product.rating || 0}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
