# Quick Backend Test - Kiểm Tra Kết Nối Backend

## 🚀 **Test Nhanh Kết Nối Backend**

### **Bước 1: Khởi động Backend**

```bash
cd nodejsBackEnd
npm run dev
```

**Kết quả mong đợi:**

```
Server is running on port 8081
Database connected successfully
```

### **Bước 2: Kiểm tra Backend Health**

```bash
curl http://localhost:8081/api/v1/health
```

**Kết quả mong đợi:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Bước 3: Test Products API**

```bash
curl http://localhost:8081/api/v1/products/admin
```

**Kết quả mong đợi:**

```json
{
  "success": true,
  "data": {
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 25,
    "totalPages": 2
  }
}
```

## 🔧 **Sử Dụng Component Test Trong UI**

### **1. Mở trang Admin Products:**

```
/admin/admin-products
```

### **2. Tìm component "Test Kết Nối Backend"**

### **3. Click "Test Kết Nối"**

### **4. Kiểm tra kết quả:**

- ✅ **Connected**: Backend hoạt động bình thường
- ❌ **Failed**: Có vấn đề với backend

## 🐛 **Các Lỗi Thường Gặp Và Cách Sửa**

### **Lỗi 1: "Connection refused"**

```bash
# Nguyên nhân: Backend chưa khởi động
# Giải pháp: Khởi động backend
cd nodejsBackEnd
npm run dev
```

### **Lỗi 2: "HTTP 404: Not Found"**

```bash
# Nguyên nhân: API endpoint không tồn tại
# Giải pháp: Kiểm tra route trong backend
# File: nodejsBackEnd/src/routes/products.ts
```

### **Lỗi 3: "HTTP 500: Internal Server Error"**

```bash
# Nguyên nhân: Lỗi backend
# Giải pháp: Kiểm tra backend logs
# Kiểm tra database connection
```

### **Lỗi 4: "Validation failed"**

```bash
# Nguyên nhân: Dữ liệu không hợp lệ
# Giải pháp: Kiểm tra request body
# Kiểm tra validation middleware
```

## 📊 **Kiểm Tra Environment Variables**

### **File .env.local:**

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1
```

### **Kiểm tra trong Console:**

```javascript
// Mở Developer Tools > Console
console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
console.log(process.env.NEXT_PUBLIC_API_VERSION);
```

## 🔍 **Debug Chi Tiết**

### **1. Kiểm tra Console Logs:**

```
"Testing backend connection to:"
"Environment config:"
"Backend health check response:"
```

### **2. Kiểm tra Network Tab:**

- Request đến `/api/test-backend`
- Response status và body
- Headers

### **3. Sử dụng Debug Component:**

- Click "Hiển thị thông tin debug"
- Click "Thu thập thông tin"
- Copy debug info

## ✅ **Checklist Test Hoàn Chỉnh**

- [ ] Backend server đang chạy trên port 8081
- [ ] Health endpoint `/api/v1/health` hoạt động
- [ ] Products endpoint `/api/v1/products/admin` hoạt động
- [ ] Environment variables đúng
- [ ] Frontend có thể kết nối đến backend
- [ ] Không có lỗi validation
- [ ] Có thể tải danh sách sản phẩm

## 🚨 **Nếu Vẫn Gặp Lỗi**

### **1. Restart toàn bộ:**

```bash
# Terminal 1: Backend
cd nodejsBackEnd
npm run dev

# Terminal 2: Frontend
cd clientCompany
npm run dev
```

### **2. Clear cache:**

```bash
# Clear browser cache
# Clear localStorage
# Clear cookies
```

### **3. Kiểm tra ports:**

```bash
# Kiểm tra port 8081 có đang được sử dụng
lsof -i :8081
netstat -an | grep 8081
```

### **4. Test với Postman:**

- Import collection từ `nodejsBackEnd/postman-collection.json`
- Test các endpoints trực tiếp

## 📞 **Liên Hệ Hỗ Trợ**

Nếu vẫn gặp vấn đề:

1. Thu thập đầy đủ debug info
2. Share logs với team
3. Tạo issue với đầy đủ thông tin
4. Mô tả các bước đã thử
