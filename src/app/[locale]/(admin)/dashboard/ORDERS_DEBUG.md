# Debug và Sửa Lỗi Cập Nhật Đơn Hàng

## 🔍 **Các vấn đề đã được sửa:**

### 1. **Logic Mapping Status:**

- ✅ **Trước:** Mapping status không nhất quán giữa Vietnamese và backend
- ✅ **Sau:** Tạo functions `getCurrentStatusInVietnamese()` và `getBackendStatus()` để xử lý đúng

### 2. **API Endpoint:**

- ✅ **Trước:** Sử dụng `process.env.NEXT_PUBLIC_API_END_POINT` không tồn tại
- ✅ **Sau:** Sử dụng `envConfig.NEXT_PUBLIC_BACKEND_URL` và `envConfig.NEXT_PUBLIC_API_VERSION`

### 3. **Cập nhật State:**

- ✅ **Trước:** `updateOrder` không cập nhật đúng trạng thái
- ✅ **Sau:** Cập nhật đúng order trong state với trạng thái mới

## 🚀 **Cách hoạt động:**

1. **Admin mở modal cập nhật đơn hàng**
2. **Frontend hiển thị trạng thái hiện tại**
3. **Admin chọn trạng thái mới**
4. **Frontend gửi request đến `/api/orders/[id]/status`**
5. **API route proxy request đến backend**
6. **Backend cập nhật và trả về response**
7. **Frontend cập nhật UI với trạng thái mới**

## 🔧 **Debug Steps:**

### **Kiểm tra Console:**

```bash
# Frontend logs
"Sending order status update:" - Kiểm tra request data
"Order status update error:" - Kiểm tra lỗi nếu có

# Backend logs
"Order status update request:" - Kiểm tra request đến backend
"Order status update response:" - Kiểm tra response từ backend
```

### **Kiểm tra Network Tab:**

1. Mở Developer Tools > Network
2. Cập nhật đơn hàng
3. Tìm request đến `/api/orders/[id]/status`
4. Kiểm tra Request/Response

### **Kiểm tra Environment Variables:**

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1
```

## 🐛 **Các lỗi thường gặp:**

### **1. "Backend URL not configured"**

- **Nguyên nhân:** Environment variable không đúng
- **Giải pháp:** Kiểm tra `.env.local` và restart dev server

### **2. "HTTP 401: Unauthorized"**

- **Nguyên nhân:** Token authentication không hợp lệ
- **Giải pháp:** Kiểm tra login và token

### **3. "HTTP 400: Bad Request"**

- **Nguyên nhân:** Status không hợp lệ
- **Giải pháp:** Kiểm tra backend validation

### **4. "HTTP 500: Internal Server Error"**

- **Nguyên nhân:** Lỗi backend
- **Giải pháp:** Kiểm tra backend logs

## 📝 **Test Cases:**

### **Test 1: Cập nhật trạng thái cơ bản**

1. Mở trang Orders
2. Click "Cập nhật trạng thái" trên một đơn hàng
3. Chọn trạng thái mới
4. Click "Cập nhật"
5. Kiểm tra UI có cập nhật không

### **Test 2: Cập nhật với ghi chú**

1. Mở modal cập nhật
2. Nhập ghi chú
3. Cập nhật trạng thái
4. Kiểm tra ghi chú có được gửi không

### **Test 3: Validation**

1. Thử cập nhật với status không hợp lệ
2. Kiểm tra error handling

## 🔄 **API Flow:**

```
Frontend → /api/orders/[id]/status → Backend → Database
   ↑                                           ↓
   ←────────── Response ←─────────── Update ←──┘
```

## 📊 **Status Mapping:**

| Backend    | Vietnamese | Description            |
| ---------- | ---------- | ---------------------- |
| PENDING    | Chờ xử lý  | Đơn hàng mới           |
| PROCESSING | Đang xử lý | Đang xử lý             |
| SHIPPED    | Đang giao  | Đã giao cho vận chuyển |
| DELIVERED  | Đã giao    | Giao hàng thành công   |
| CANCELLED  | Đã huỷ     | Đơn hàng bị huỷ        |

## 🚨 **Nếu vẫn gặp lỗi:**

1. **Kiểm tra backend có chạy không:** `http://localhost:8081`
2. **Kiểm tra authentication:** Login admin và token
3. **Kiểm tra CORS:** Backend có cho phép frontend domain không
4. **Kiểm tra logs:** Cả frontend và backend
5. **Test API trực tiếp:** Sử dụng Postman hoặc curl
