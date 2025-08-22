"use client"; // Required for Next.js 14+ App Router to use hooks

import React, { useState } from "react";

// Định nghĩa kiểu dữ liệu cho thông tin liên hệ và gói hàng bằng TypeScript
// ---
// Define TypeScript interfaces for contact and package information
interface ContactInfo {
  hoTen: string;
  soDienThoai: string;
  diaChi: string;
}

interface PackageInfo {
  tenSanPham: string;
  soLuong: number;
  khoiLuong: number;
  tienThuHo: number;
  ghiChu: string;
}

// Component chính của ứng dụng
// ---
// Main App component
export default function ShippingLabelCreator() {
  // Khởi tạo state cho thông tin người gửi, người nhận và gói hàng
  // ---
  // Initialize state for sender, receiver, and package information
  const [senderInfo, setSenderInfo] = useState<ContactInfo>({
    hoTen: "Cửa Hàng ABC",
    soDienThoai: "0987654321",
    diaChi: "123 Đường Láng, Đống Đa, Hà Nội",
  });

  const [receiverInfo, setReceiverInfo] = useState<ContactInfo>({
    hoTen: "",
    soDienThoai: "",
    diaChi: "",
  });

  const [packageInfo, setPackageInfo] = useState<PackageInfo>({
    tenSanPham: "Áo thun và Quần jean",
    soLuong: 2,
    khoiLuong: 0.5,
    tienThuHo: 0,
    ghiChu: "Hàng dễ vỡ, xin nhẹ tay.",
  });

  // Hàm xử lý khi có thay đổi trong các ô input
  // ---
  // Handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value, type } = e.target;
    // Chuyển đổi giá trị sang số nếu input là type 'number'
    // ---
    // Convert value to number if the input type is 'number'
    const finalValue = type === "number" ? parseFloat(value) || 0 : value;
    setter((prevState: any) => ({
      ...prevState,
      [name]: finalValue,
    }));
  };

  // Hàm xử lý việc in ấn
  // ---
  // Handler for printing
  const handlePrint = () => {
    window.print();
  };

  // Hàm định dạng tiền tệ (VND)
  // ---
  // Function to format currency (VND)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
      {/* CSS Tối Ưu Hóa In Ấn
        - .no-print: Ẩn các thành phần không cần thiết khi in (form, nút, header...).
        - .print-container: Reset lại position của container chứa vận đơn để tránh lỗi layout.
        - #label-preview: Định dạng lại vận đơn để hiển thị đúng trên trang in.
      */}
      <style jsx global>{`
        @media print {
          /* Ẩn các phần tử không muốn in */
          .no-print {
            display: none !important;
          }

          /* [SỬA LỖI] Vô hiệu hóa position:sticky để tránh xung đột layout khi in */
          .print-container {
            position: static !important;
          }

          /* Ẩn tất cả mọi thứ trên trang */
          body * {
            visibility: hidden;
          }

          /* Chỉ hiển thị khu vực vận đơn và nội dung bên trong nó */
          #label-preview,
          #label-preview * {
            visibility: visible;
          }

          /* Định vị lại vận đơn để nó chiếm toàn bộ trang in */
          #label-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            border: none !important;
            box-shadow: none !important;
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>

      <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8 no-print">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Tạo Vận Đơn Giao Hàng
            </h1>
            <p className="text-gray-600 mt-2">
              Nhập thông tin vào biểu mẫu bên dưới và xem trước vận đơn của bạn.
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Cột Form Nhập Liệu */}
            <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-xl shadow-lg no-print">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* Thông tin người gửi */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">
                    📦 Thông Tin Người Gửi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="senderName"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        id="senderName"
                        name="hoTen"
                        value={senderInfo.hoTen}
                        onChange={(e) => handleInputChange(e, setSenderInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="senderPhone"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="senderPhone"
                        name="soDienThoai"
                        value={senderInfo.soDienThoai}
                        onChange={(e) => handleInputChange(e, setSenderInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="senderAddress"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Địa chỉ lấy hàng
                      </label>
                      <input
                        type="text"
                        id="senderAddress"
                        name="diaChi"
                        value={senderInfo.diaChi}
                        onChange={(e) => handleInputChange(e, setSenderInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin người nhận */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">
                    🏠 Thông Tin Người Nhận
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="receiverName"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        id="receiverName"
                        name="hoTen"
                        placeholder="Nguyễn Văn A"
                        value={receiverInfo.hoTen}
                        onChange={(e) => handleInputChange(e, setReceiverInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="receiverPhone"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="receiverPhone"
                        name="soDienThoai"
                        placeholder="0123456789"
                        value={receiverInfo.soDienThoai}
                        onChange={(e) => handleInputChange(e, setReceiverInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="receiverAddress"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Địa chỉ giao hàng
                      </label>
                      <input
                        type="text"
                        id="receiverAddress"
                        name="diaChi"
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        value={receiverInfo.diaChi}
                        onChange={(e) => handleInputChange(e, setReceiverInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin gói hàng */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">
                    📋 Thông Tin Gói Hàng
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="productName"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Nội dung hàng hóa (ghi rõ)
                      </label>
                      <input
                        type="text"
                        id="productName"
                        name="tenSanPham"
                        value={packageInfo.tenSanPham}
                        onChange={(e) => handleInputChange(e, setPackageInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Số lượng
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="soLuong"
                        min="1"
                        value={packageInfo.soLuong}
                        onChange={(e) => handleInputChange(e, setPackageInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Khối lượng (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="khoiLuong"
                        step="0.1"
                        min="0"
                        value={packageInfo.khoiLuong}
                        onChange={(e) => handleInputChange(e, setPackageInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="cod"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Tiền thu hộ (COD - VND)
                      </label>
                      <input
                        type="number"
                        id="cod"
                        name="tienThuHo"
                        min="0"
                        value={packageInfo.tienThuHo}
                        onChange={(e) => handleInputChange(e, setPackageInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Ghi chú
                      </label>
                      <textarea
                        id="notes"
                        name="ghiChu"
                        rows={3}
                        value={packageInfo.ghiChu}
                        onChange={(e) => handleInputChange(e, setPackageInfo)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Cột Xem Trước Vận Đơn */}
            <div className="lg:col-span-2">
              {/* [SỬA LỖI] Thêm class 'print-container' vào đây */}
              <div className="sticky top-8 print-container">
                <div
                  id="label-preview"
                  className="bg-white p-6 rounded-xl shadow-lg border-2 border-dashed border-gray-400"
                >
                  <header className="flex justify-between items-center border-b-2 border-black pb-2">
                    <div>
                      <h3 className="font-bold text-xl">LALA-LYCHEEE</h3>
                      <p className="text-sm">Hotline: 0962-215-666</p>
                    </div>
                    <div className="text-right">LLLC123456789</div>
                  </header>
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="border-r-2 border-gray-300 pr-4">
                      <p className="text-xs text-gray-500">BÊN GỬI</p>
                      <p className="font-bold">{senderInfo.hoTen || "..."}</p>
                      <p className="text-sm">
                        {senderInfo.soDienThoai || "..."}
                      </p>
                      <p className="text-sm">{senderInfo.diaChi || "..."}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">BÊN NHẬN</p>
                      <p className="font-bold">{receiverInfo.hoTen || "..."}</p>
                      <p className="text-sm">
                        {receiverInfo.soDienThoai || "..."}
                      </p>
                      <p className="text-sm">{receiverInfo.diaChi || "..."}</p>
                    </div>
                  </div>
                  <div className="border-t-2 border-b-2 border-black py-2 my-2">
                    <p className="font-bold text-center text-lg">
                      Tiền thu hộ: {formatCurrency(packageInfo.tienThuHo)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">NỘI DUNG HÀNG HÓA</p>
                    <p className="font-semibold">
                      {packageInfo.tenSanPham || "Chưa nhập tên sản phẩm"}
                    </p>
                    <p className="text-sm mt-1">
                      KL:{" "}
                      <span className="font-semibold">
                        {packageInfo.khoiLuong} kg
                      </span>{" "}
                      - SL:{" "}
                      <span className="font-semibold">
                        {packageInfo.soLuong}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 border-t-2 border-gray-300 pt-2">
                    <p className="text-xs text-gray-500">GHI CHÚ</p>
                    <p className="text-sm italic">
                      {packageInfo.ghiChu || "Không có"}
                    </p>
                  </div>
                  <footer className="mt-4 pt-2 text-center text-xs text-gray-500">
                    <p>Người nhận kiểm tra hàng trước khi thanh toán.</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ!</p>
                  </footer>
                </div>

                <div className="mt-6 text-center no-print">
                  <button
                    onClick={handlePrint}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
                  >
                    🖨️ In Vận Đơn
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
