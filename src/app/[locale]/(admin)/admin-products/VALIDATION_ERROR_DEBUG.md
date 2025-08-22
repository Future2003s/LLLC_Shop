# Debug Lỗi "Validation failed" - Quản Lý Sản Phẩm

## 🚨 **Lỗi đang gặp phải:**

```
Lỗi khi tải dữ liệu: Validation failed
```

## 🔍 **Nguyên nhân có thể:**

### 1. **Backend không khởi động hoặc không thể kết nối:**

- Backend server chưa chạy
- Port 8081 bị block hoặc đang được sử dụng
- Firewall chặn kết nối

### 2. **API Endpoint không đúng:**

- URL backend không đúng
- API version không đúng
- Route không tồn tại

### 3. **Environment Variables không đúng:**

- `NEXT_PUBLIC_BACKEND_URL` không đúng
- `NEXT_PUBLIC_API_VERSION` không đúng
- File `.env.local` không được load

### 4. **Authentication/Authorization:**

- Token không hợp lệ
- User không có quyền admin
- Session hết hạn

### 5. **Backend Validation Error:**

- Dữ liệu gửi không hợp lệ
- Schema validation fail
- Database connection error

## 🔧 **Các bước debug:**

### **Bước 1: Kiểm tra Backend**

```bash
# Kiểm tra backend có chạy không
cd nodejsBackEnd
npm run dev

# Kiểm tra port 8081
netstat -an | grep 8081
# hoặc
lsof -i :8081
```

### **Bước 2: Kiểm tra Environment Variables**

```bash
# Kiểm tra .env.local
cat .env.local

# Đảm bảo có các biến sau:
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1
```

### **Bước 3: Test API trực tiếp**

```bash
# Test backend health
curl http://localhost:8081/api/v1/health

# Test products endpoint
curl http://localhost:8081/api/v1/products/admin
```

### **Bước 4: Kiểm tra Console Logs**

1. Mở Developer Tools > Console
2. Tìm các log sau:
   ```
   "Fetching admin products from:"
   "Query parameters:"
   "Admin products response status:"
   "Backend validation error:"
   ```

### **Bước 5: Sử dụng Debug Component**

1. Click "Hiển thị thông tin debug"
2. Click "Thu thập thông tin"
3. Kiểm tra thông tin debug
4. Copy thông tin để share với team

## 🐛 **Các lỗi cụ thể và cách sửa:**

### **Lỗi 1: "Backend URL not configured"**

```bash
# Sửa .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1

# Restart dev server
npm run dev
```

### **Lỗi 2: "Connection refused"**

```bash
# Kiểm tra backend có chạy không
cd nodejsBackEnd
npm run dev

# Kiểm tra port
lsof -i :8081
```

### **Lỗi 3: "HTTP 401: Unauthorized"**

```bash
# Login lại với tài khoản admin
# Kiểm tra token trong localStorage
# Kiểm tra cookies
```

### **Lỗi 4: "HTTP 404: Not Found"**

```bash
# Kiểm tra route trong backend
# Kiểm tra API version
# Kiểm tra URL endpoint
```

### **Lỗi 5: "HTTP 500: Internal Server Error"**

```bash
# Kiểm tra backend logs
# Kiểm tra database connection
# Kiểm tra middleware
```

## 📊 **Thông tin Debug cần thu thập:**

### **Frontend Info:**

- URL hiện tại
- User Agent
- Local Storage (token, user)
- Session Storage
- Cookies
- Environment variables

### **Backend Info:**

- Health check status
- API response status
- Error details
- Request headers
- Response headers

### **Network Info:**

- Request URL
- Request method
- Request headers
- Response status
- Response body
- Error details

## 🚀 **Cách sửa nhanh:**

### **1. Restart cả Frontend và Backend:**

```bash
# Terminal 1 - Backend
cd nodejsBackEnd
npm run dev

# Terminal 2 - Frontend
cd clientCompany
npm run dev
```

### **2. Clear Cache và Storage:**

```bash
# Clear localStorage
localStorage.clear()

# Clear sessionStorage
sessionStorage.clear()

# Clear cookies
document.cookie.split(";").forEach(function(c) {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

### **3. Kiểm tra Authentication:**

```bash
# Login lại với admin account
# Kiểm tra token có hợp lệ không
# Kiểm tra user role có phải admin không
```

## 📝 **Test Cases để xác nhận đã sửa:**

### **Test 1: Backend Health Check**

```bash
curl http://localhost:8081/api/v1/health
# Expected: {"success": true, "message": "Server is running"}
```

### **Test 2: Products API**

```bash
curl http://localhost:8081/api/v1/products/admin
# Expected: JSON response với danh sách sản phẩm
```

### **Test 3: Frontend Products Page**

1. Mở `/admin/admin-products`
2. Không có error message
3. Hiển thị danh sách sản phẩm
4. Có thể tạo/sửa/xóa sản phẩm

## 🔮 **Prevention - Tránh lỗi tương lai:**

### **1. Environment Variables:**

- Luôn kiểm tra `.env.local` trước khi dev
- Sử dụng validation cho env vars
- Có fallback values

### **2. Error Handling:**

- Luôn có try-catch cho API calls
- Log đầy đủ error details
- Hiển thị user-friendly error messages

### **3. Health Checks:**

- Kiểm tra backend trước khi gọi API
- Có retry mechanism
- Graceful degradation

### **4. Monitoring:**

- Log tất cả API calls
- Monitor response times
- Alert khi có lỗi

## 📚 **Tài liệu tham khảo:**

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Node.js Error Handling](https://nodejs.org/en/docs/guides/error-handling-and-patterns/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Debug Component Documentation](./DebugInfo.tsx)

## 🆘 **Nếu vẫn không sửa được:**

1. **Thu thập đầy đủ debug info**
2. **Share logs với team**
3. **Kiểm tra backend logs**
4. **Test với Postman/curl**
5. **Tạo issue với đầy đủ thông tin**
