"use client";
import React, { useMemo, useState } from "react";
import { useAppContextProvider } from "@/context/app-context";
import { ButtonLoader } from "@/components/ui/loader";

export interface BuyNowItem {
  name: string;
  price: number;
  quantity: number;
}

interface BuyNowModalProps {
  open: boolean;
  onClose: () => void;
  items: BuyNowItem[];
}

interface OrderSuccessData {
  orderNumber: string;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: BuyNowItem[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export default function BuyNowModal({
  open,
  onClose,
  items,
}: BuyNowModalProps) {
  const { sessionToken } = useAppContextProvider();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [orderSuccessData, setOrderSuccessData] =
    useState<OrderSuccessData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank">("cod");
  const [countdown, setCountdown] = useState<number | null>(null);

  const { totalQty, totalPrice } = useMemo(() => {
    const totalQty = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
    const totalPrice = items.reduce(
      (s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0),
      0
    );
    return { totalQty, totalPrice };
  }, [items]);

  const createPayment = async () => {
    if (totalPrice <= 0 || totalQty <= 0) {
      setError("Vui lòng chọn sản phẩm và số lượng hợp lệ.");
      return;
    }
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError("Vui lòng nhập họ tên, số điện thoại và địa chỉ nhận hàng.");
      return;
    }
    // Login is optional for guest checkout
    // if (!sessionToken) {
    //   setError("Vui lòng đăng nhập trước khi đặt hàng.");
    //   return;
    // }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const orderItems = items
      .filter((it) => it.quantity > 0)
      .map((it) => ({ name: it.name, quantity: it.quantity, price: it.price }));

    const orderPayload = {
      amount: totalPrice,
      description: `${totalQty} sản phẩm - Người mua: ${fullName} - ĐT: ${phone}`,
      items: orderItems,
      customer: { fullName, phone, email, address, note },
      paymentMethod,
    };

    try {
      if (paymentMethod === "bank") {
        const response = await fetch(
          "https://api.lalalycheee.vn/create-payment-link",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
          }
        );
        if (!response.ok) {
          let errorData;
          try {
            const text = await response.text();
            errorData = text ? JSON.parse(text) : {};
          } catch (error) {
            console.error("JSON parse error:", error);
            errorData = {};
          }
          throw new Error(errorData.message || "Tạo link thanh toán thất bại!");
        }
        let result;
        try {
          const text = await response.text();
          result = text ? JSON.parse(text) : null;
        } catch (error) {
          console.error("JSON parse error:", error);
          throw new Error("Lỗi khi parse response");
        }
        if (result && result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        } else {
          throw new Error(
            "Không nhận được checkoutUrl từ phản hồi của server."
          );
        }
      } else {
        // Prepare headers - include auth if available
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (sessionToken) {
          headers.Authorization = `Bearer ${sessionToken}`;
        }

        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers,
          body: JSON.stringify(orderPayload),
        });
        if (!response.ok) {
          let errorData;
          try {
            const text = await response.text();
            errorData = text ? JSON.parse(text) : {};
          } catch (error) {
            console.error("JSON parse error:", error);
            errorData = {};
          }
          throw new Error(errorData.message || "Đặt hàng COD thất bại!");
        }

        // Parse response to get order details
        let orderResult;
        try {
          const text = await response.text();
          orderResult = text ? JSON.parse(text) : null;
        } catch (error) {
          console.error("JSON parse error:", error);
          orderResult = null;
        }

        // Create order success data
        const orderNumber = orderResult?.data?.orderNumber || "N/A";
        const orderTotal = orderResult?.data?.total || totalPrice;

        setOrderSuccessData({
          orderNumber,
          total: orderTotal,
          customerName: fullName,
          customerPhone: phone,
          customerAddress: address,
          items: orderItems,
        });

        // Start countdown and auto close modal after 5 seconds
        setCountdown(5);
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(countdownInterval);
              onClose();
              // Reset form
              setFullName("");
              setPhone("");
              setEmail("");
              setAddress("");
              setNote("");
              setSuccess(null);
              setError(null);
              setOrderSuccessData(null);
              setCountdown(null);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã có lỗi không xác định."
      );
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Thông tin mua hàng</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[80vh] overflow-auto">
          {!orderSuccessData && (
            <>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sản phẩm</h4>
                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="truncate pr-2">
                        {it.name} × {it.quantity}
                      </div>
                      <div className="font-medium">
                        {formatCurrency(it.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Tổng cộng ({totalQty} sản phẩm)
                    </div>
                    <div className="text-pink-600 font-semibold">
                      {formatCurrency(totalPrice)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Thông tin khách hàng
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xxxxxxxx"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Email (tuỳ chọn)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Địa chỉ nhận hàng
                    </label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Ghi chú (tuỳ chọn)
                    </label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Hình thức thanh toán
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`border rounded-md p-3 cursor-pointer flex items-start gap-3 ${
                      paymentMethod === "cod"
                        ? "border-pink-500 ring-1 ring-pink-200"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div>
                      <div className="font-medium">
                        Thanh toán khi nhận hàng (COD)
                      </div>
                      <div className="text-sm text-gray-500">
                        Thanh toán tiền mặt khi đơn hàng được giao.
                      </div>
                    </div>
                  </label>
                  <label
                    className={`border rounded-md p-3 cursor-pointer flex items-start gap-3 ${
                      paymentMethod === "bank"
                        ? "border-pink-500 ring-1 ring-pink-200"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                    />
                    <div>
                      <div className="font-medium">
                        Chuyển khoản/Thanh toán online
                      </div>
                      <div className="text-sm text-gray-500">
                        Tạo link thanh toán và thanh toán qua ngân hàng.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}
            </>
          )}

          {orderSuccessData && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
              {/* Success Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  🎉 Đặt hàng thành công!
                </h3>
                <p className="text-green-600">
                  Cảm ơn bạn đã tin tưởng chúng tôi
                </p>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                {/* Order Number */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Mã đơn hàng:
                    </span>
                    <span className="text-lg font-bold text-green-700 font-mono">
                      {orderSuccessData.orderNumber}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-3">
                    👤 Thông tin khách hàng
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">
                        {orderSuccessData.customerName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-medium">
                        {orderSuccessData.customerPhone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-medium text-right max-w-xs">
                        {orderSuccessData.customerAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-3">
                    📦 Sản phẩm đã đặt
                  </h4>
                  <div className="space-y-2">
                    {orderSuccessData.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span className="text-gray-800">Tổng tiền:</span>
                        <span className="text-green-600">
                          {formatCurrency(orderSuccessData.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    📞 Bước tiếp theo
                  </h4>
                  <p className="text-sm text-blue-800">
                    Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận đơn
                    hàng và sắp xếp giao hàng.
                  </p>
                </div>

                {/* Countdown */}
                {countdown !== null && countdown > 0 && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      Cửa sổ sẽ tự động đóng sau{" "}
                      <span className="font-bold text-green-600">
                        {countdown}
                      </span>{" "}
                      giây
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(countdown / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!orderSuccessData && (
          <div className="px-5 py-4 border-t flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Đóng
            </button>
            <button
              onClick={createPayment}
              disabled={loading}
              className="ml-auto px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 disabled:bg-gray-400"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <ButtonLoader size="sm" />
                  <span>Đang xử lý...</span>
                </div>
              ) : paymentMethod === "bank" ? (
                "Tiến hành Thanh toán"
              ) : (
                "Đặt hàng COD"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
