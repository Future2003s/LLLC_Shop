# 🔗 Hướng dẫn tích hợp Backend Node.js với Frontend Next.js

## 📋 Tổng quan

Dự án này đã được tích hợp hoàn toàn với backend Node.js ShopDev. Khi người dùng đăng nhập thành công, họ sẽ được tự động chuyển hướng đến trang cá nhân (`/me`).

## 🚀 Tính năng đã tích hợp

### ✅ Authentication & Authorization

- **Đăng nhập/Đăng ký** với backend Node.js
- **JWT Token management** (access + refresh tokens)
- **Auto-redirect** đến trang cá nhân sau khi đăng nhập
- **Persistent login** với localStorage
- **Role-based access control**

### ✅ User Management

- **Trang cá nhân** hiển thị thông tin từ backend
- **Quản lý địa chỉ** (thêm, sửa, xóa)
- **Cập nhật thông tin cá nhân**
- **Quản lý tùy chọn** (ngôn ngữ, tiền tệ, notifications)

### ✅ E-commerce Features

- **Quản lý sản phẩm** với backend API
- **Giỏ hàng** tích hợp backend
- **Đơn hàng** và lịch sử mua hàng
- **Đánh giá sản phẩm**
- **Danh mục sản phẩm**

## 🛠️ Cài đặt và cấu hình

### 1. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc:

```env
# Frontend Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_API_END_POINT=http://localhost:8081/api/v1
NEXT_PUBLIC_URL_LOGO=/logo.png

# Backend Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1
```

### 2. Khởi động Backend

```bash
cd nodejsBackEnd
npm install
npm run dev
```

Backend sẽ chạy tại: `http://localhost:8081`

### 3. Khởi động Frontend

```bash
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🔐 Luồng đăng nhập

### 1. User nhập email/password

### 2. Frontend gọi API `POST /auth/login`

### 3. Backend xác thực và trả về JWT tokens

### 4. Frontend lưu tokens vào localStorage

### 5. **Auto-redirect** đến `/me` (trang cá nhân)

### 6. Trang cá nhân hiển thị thông tin user từ backend

## 📁 Cấu trúc files đã tạo/cập nhật

```
src/
├── apiRequests/           # API requests đến backend
│   ├── auth.ts           # Authentication APIs
│   ├── users.ts          # User management APIs
│   ├── products.ts       # Product APIs
│   ├── cart.ts           # Cart APIs
│   ├── orders.ts         # Order APIs
│   ├── categories.ts     # Category APIs
│   ├── reviews.ts        # Review APIs
│   └── index.ts          # Export tất cả APIs
├── hooks/
│   ├── useAuth.ts        # Authentication hook
│   └── useApi.ts         # Generic API hook
├── components/
│   └── auth/
│       └── UserMenu.tsx  # User menu component
├── app/[locale]/me/      # Trang cá nhân
│   ├── page.tsx          # Profile page
│   ├── useMe.ts          # User data hook
│   └── query.ts          # Backend API calls
└── lib/
    └── http.ts           # HTTP client (updated)
```

## 🧪 Test chức năng

### Test Login

1. Truy cập `/test-login` để test chức năng đăng nhập
2. Sử dụng email: `adadad@gmail.com` và password: `Password123`
3. Kiểm tra console để xem logs
4. Sau khi đăng nhập thành công, sẽ tự động chuyển đến `/{locale}/me`
5. Sử dụng **Routing Debug** component để test redirects và locale extraction

## 🎯 Cách sử dụng

### 1. Sử dụng Authentication Hook

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập</div>;
  }

  return (
    <div>
      <h1>Xin chào {user.firstName}!</h1>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### 2. Gọi API Backend

```tsx
import { productsApiRequest } from "@/apiRequests/products";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productsApiRequest.getAll();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Render products...
}
```

### 3. Sử dụng UserMenu Component

```tsx
import { UserMenu } from "@/components/auth/UserMenu";

function Header() {
  return (
    <header>
      <div className="flex items-center justify-between">
        <Logo />
        <UserMenu /> {/* Tự động hiển thị login/register hoặc user menu */}
      </div>
    </header>
  );
}
```

## 🔒 Bảo mật

- **JWT tokens** được lưu trong cookies với `SameSite=Strict`
- **Session token** hết hạn sau 7 ngày
- **Refresh token** hết hạn sau 30 ngày
- **Auto-refresh** token khi hết hạn
- **Role-based access control** cho admin routes
- **Secure HTTP headers** với Helmet
- **CORS protection** cho API endpoints

## 🚨 Troubleshooting

### 1. Backend không kết nối được

- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra port 8081 có bị chiếm không
- Kiểm tra file `.env` của backend

### 2. Frontend không gọi được API

- Kiểm tra `NEXT_PUBLIC_BACKEND_URL` trong `.env.local`
- Kiểm tra CORS configuration trong backend
- Kiểm tra network tab trong DevTools

### 3. Authentication không hoạt động

- Kiểm tra JWT_SECRET trong backend
- Kiểm tra token có được lưu trong localStorage không
- Kiểm tra API response format

## 📚 API Endpoints

### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/me` - Lấy thông tin user
- `POST /auth/logout` - Đăng xuất

### User Management

- `GET /users/profile` - Lấy profile
- `PUT /users/profile` - Cập nhật profile
- `GET /users/addresses` - Lấy địa chỉ
- `POST /users/addresses` - Thêm địa chỉ

### Products

- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `GET /products?category=...` - Lọc theo danh mục

### Cart & Orders

- `GET /cart` - Lấy giỏ hàng
- `POST /cart/add` - Thêm vào giỏ hàng
- `GET /orders` - Lấy đơn hàng
- `POST /orders` - Tạo đơn hàng mới

## 🎉 Kết quả

Sau khi tích hợp hoàn tất:

1. ✅ **Đăng nhập thành công** → Tự động chuyển đến `/me`
2. ✅ **Trang cá nhân** hiển thị đầy đủ thông tin từ backend
3. ✅ **Persistent login** - Không cần đăng nhập lại khi refresh
4. ✅ **Real-time data** từ backend database
5. ✅ **Secure authentication** với JWT tokens
6. ✅ **Role-based access** cho admin features

## 🔄 Cập nhật tiếp theo

- [ ] Thêm refresh token auto-renewal
- [ ] Implement admin dashboard
- [ ] Thêm payment integration
- [ ] Real-time notifications
- [ ] Advanced search & filtering
- [ ] Multi-language support
- [ ] Mobile app integration
