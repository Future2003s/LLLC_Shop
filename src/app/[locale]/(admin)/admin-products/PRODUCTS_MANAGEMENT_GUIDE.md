# Hướng Dẫn Quản Lý Sản Phẩm

## 🚀 **Tính năng chính:**

### 1. **Xem danh sách sản phẩm:**

- ✅ Hiển thị sản phẩm dạng grid với hình ảnh
- ✅ Thông tin: tên, giá, tồn kho, trạng thái, danh mục, thương hiệu
- ✅ Phân trang và tìm kiếm
- ✅ Lọc theo danh mục và trạng thái

### 2. **Thêm sản phẩm mới:**

- ✅ Form nhập thông tin đầy đủ
- ✅ Validation dữ liệu
- ✅ Upload hình ảnh
- ✅ Chọn danh mục và thương hiệu

### 3. **Chỉnh sửa sản phẩm:**

- ✅ Load thông tin hiện tại
- ✅ Cập nhật từng trường
- ✅ Validation dữ liệu
- ✅ Lưu thay đổi

### 4. **Xem chi tiết sản phẩm:**

- ✅ Modal hiển thị đầy đủ thông tin
- ✅ Hình ảnh sản phẩm
- ✅ Nút chỉnh sửa và xóa

### 5. **Xóa sản phẩm:**

- ✅ Xác nhận trước khi xóa
- ✅ Cập nhật UI ngay lập tức
- ✅ Loading state khi xóa

## 🔧 **Cải thiện đã thực hiện:**

### 1. **API Endpoints:**

- ✅ Sửa URL backend đúng: `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}`
- ✅ Thêm logging để debug
- ✅ Error handling tốt hơn

### 2. **Validation:**

- ✅ Tên sản phẩm không được để trống
- ✅ Giá phải lớn hơn 0
- ✅ Tồn kho không được âm
- ✅ Danh mục bắt buộc chọn
- ✅ SKU không được để trống

### 3. **Error Handling:**

- ✅ Hiển thị lỗi rõ ràng
- ✅ Nút "Thử lại" khi có lỗi
- ✅ Toast notifications cho thành công/thất bại
- ✅ Console logging để debug

### 4. **Loading States:**

- ✅ Skeleton loading cho products grid
- ✅ Loading spinner cho actions
- ✅ Disable buttons khi đang xử lý

### 5. **UI/UX:**

- ✅ Responsive design
- ✅ Hover effects và transitions
- ✅ Status badges với màu sắc phù hợp
- ✅ Stock indicators

## 📊 **Cấu trúc dữ liệu sản phẩm:**

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: string;
  brandId: string;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  images: string[];
  category: string;
  brand: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🔄 **API Flow:**

### **Lấy danh sách sản phẩm:**

```
Frontend → /api/products/admin → Backend → Database
   ↑                                           ↓
   ←────────── Response ←─────────── Query ←──┘
```

### **Tạo sản phẩm:**

```
Frontend → /api/products/create → Backend → Database
   ↑                                           ↓
   ←────────── Response ←─────────── Insert ←──┘
```

### **Cập nhật sản phẩm:**

```
Frontend → /api/products/[id] → Backend → Database
   ↑                                           ↓
   ←────────── Response ←─────────── Update ←──┘
```

### **Xóa sản phẩm:**

```
Frontend → /api/products/[id] → Backend → Database
   ↑                                           ↓
   ←────────── Response ←─────────── Delete ←──┘
```

## 🐛 **Debug và Troubleshooting:**

### **1. Kiểm tra Console:**

```bash
# Frontend logs
"Fetching products with params:" - Kiểm tra query parameters
"Products response status:" - Kiểm tra HTTP status
"Products response data:" - Kiểm tra response data
"Submitting product data:" - Kiểm tra data gửi đi

# Backend logs
"Fetching admin products from:" - Kiểm tra URL backend
"Admin products response status:" - Kiểm tra response từ backend
```

### **2. Kiểm tra Network Tab:**

1. Mở Developer Tools > Network
2. Thực hiện action (fetch, create, update, delete)
3. Tìm request tương ứng
4. Kiểm tra Request/Response

### **3. Kiểm tra Environment Variables:**

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1
```

## 📝 **Test Cases:**

### **Test 1: Tạo sản phẩm mới**

1. Click "Thêm sản phẩm mới"
2. Nhập thông tin đầy đủ
3. Click "Lưu"
4. Kiểm tra sản phẩm xuất hiện trong danh sách

### **Test 2: Chỉnh sửa sản phẩm**

1. Click "Chỉnh sửa" trên một sản phẩm
2. Thay đổi thông tin
3. Click "Lưu"
4. Kiểm tra thông tin được cập nhật

### **Test 3: Xóa sản phẩm**

1. Click "Xóa" trên một sản phẩm
2. Xác nhận xóa
3. Kiểm tra sản phẩm biến mất khỏi danh sách

### **Test 4: Tìm kiếm và lọc**

1. Nhập từ khóa tìm kiếm
2. Chọn danh mục
3. Chọn trạng thái
4. Kiểm tra kết quả lọc

### **Test 5: Validation**

1. Thử tạo sản phẩm với dữ liệu không hợp lệ
2. Kiểm tra error messages
3. Kiểm tra form không submit

## 🚨 **Các lỗi thường gặp:**

### **1. "Backend URL not configured"**

- **Nguyên nhân:** Environment variable không đúng
- **Giải pháp:** Kiểm tra `.env.local` và restart dev server

### **2. "HTTP 401: Unauthorized"**

- **Nguyên nhân:** Token authentication không hợp lệ
- **Giải pháp:** Kiểm tra login admin và token

### **3. "HTTP 400: Bad Request"**

- **Nguyên nhân:** Dữ liệu gửi không hợp lệ
- **Giải pháp:** Kiểm tra validation và data format

### **4. "HTTP 500: Internal Server Error"**

- **Nguyên nhân:** Lỗi backend
- **Giải pháp:** Kiểm tra backend logs

## 🔮 **Tính năng có thể thêm:**

1. **Bulk Actions:** Chọn nhiều sản phẩm để xóa/cập nhật hàng loạt
2. **Import/Export:** Import sản phẩm từ Excel/CSV
3. **Product Variants:** Quản lý biến thể sản phẩm (size, color)
4. **Inventory Management:** Theo dõi nhập/xuất kho
5. **Product Analytics:** Thống kê hiệu suất sản phẩm
6. **SEO Management:** Quản lý meta tags, URL slugs
7. **Product Reviews:** Quản lý đánh giá sản phẩm
8. **Related Products:** Sản phẩm liên quan

## 📚 **Tài liệu tham khảo:**

- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
