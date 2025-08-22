# 🚀 Frontend API Integration Guide

## Tổng quan

Hệ thống frontend đã được xây dựng để tích hợp chính xác với Node.js backend dựa trên `API_DOCUMENTATION.md`, cung cấp một kiến trúc API service layer hoàn chỉnh với error handling, retry mechanism, và type safety.

## 🏗️ Kiến trúc hệ thống

```
src/
├── lib/
│   ├── http.ts              # Enhanced HTTP client với error handling
│   └── api-config.ts        # API configuration và helper functions
├── services/
│   ├── api.service.ts       # Base API service class
│   ├── auth.service.ts      # Authentication service
│   └── product.service.ts   # Product management service
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   └── useProducts.ts      # Product management hook
├── components/
│   └── ApiTestComponent.tsx # Component test API endpoints
└── apiRequests/             # Legacy API requests (có thể refactor)
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env.local` với các biến môi trường:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_URL_LOGO=https://example.com/logo.png
```

### API Configuration

Hệ thống tự động sử dụng cấu hình từ `src/lib/api-config.ts` dựa trên `API_DOCUMENTATION.md`:

```typescript
export const API_CONFIG = {
  BACKEND_BASE_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081",
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",

  get API_BASE_URL() {
    return `${this.BACKEND_BASE_URL}/api/${this.API_VERSION}`;
  },

  // Health check endpoint từ API_DOCUMENTATION.md
  HEALTH: "/health",

  // Test endpoint từ API_DOCUMENTATION.md
  TEST: "/test",

  // Auth endpoints - matching exactly với API_DOCUMENTATION.md
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password/:token",
    VERIFY_EMAIL: "/auth/verify-email/:token",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },
  // ... other configs
};
```

## 🚀 Sử dụng Services

### 1. Authentication Service

```typescript
import { authService } from "@/services/auth.service";

// Đăng ký user mới (sử dụng endpoint /auth/register từ API_DOCUMENTATION.md)
const registerUser = async () => {
  try {
    const response = await authService.register({
      fullName: "John Doe", // Theo RegisterRequest schema
      email: "john@example.com",
      password: "Password123",
    });

    console.log("User registered:", response.data.user);
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

// Đăng nhập (sử dụng endpoint /auth/login từ API_DOCUMENTATION.md)
const loginUser = async () => {
  try {
    const response = await authService.login({
      email: "john@example.com",
      password: "Password123",
      rememberMe: true,
    });

    console.log("Login successful:", response.data.user);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Lấy thông tin user hiện tại (sử dụng endpoint /auth/me từ API_DOCUMENTATION.md)
const getCurrentUser = async (token: string) => {
  try {
    const response = await authService.getCurrentUser(token);
    console.log("Current user:", response.data);
  } catch (error) {
    console.error("Failed to get user:", error);
  }
};

// Test connection (sử dụng endpoint /health từ API_DOCUMENTATION.md)
const testBackendConnection = async () => {
  try {
    const result = await authService.testConnection();
    console.log("Backend connection:", result);
  } catch (error) {
    console.error("Connection test failed:", error);
  }
};

// Test API (sử dụng endpoint /test từ API_DOCUMENTATION.md)
const testApiEndpoint = async () => {
  try {
    const result = await authService.testApi();
    console.log("API test:", result);
  } catch (error) {
    console.error("API test failed:", error);
  }
};
```

### 2. Product Service

```typescript
import { productService } from "@/services/product.service";

// Lấy tất cả sản phẩm
const getAllProducts = async () => {
  try {
    const response = await productService.getProducts(
      { isFeatured: true }, // filters
      1, // page
      20 // limit
    );

    console.log("Products:", response.data.products);
    console.log("Pagination:", response.data.pagination);
  } catch (error) {
    console.error("Failed to get products:", error);
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (productId: string) => {
  try {
    const response = await productService.getProductById(productId);
    console.log("Product:", response.data);
  } catch (error) {
    console.error("Failed to get product:", error);
  }
};

// Tìm kiếm sản phẩm
const searchProducts = async (query: string) => {
  try {
    const response = await productService.searchProducts(query, {
      minPrice: 100,
      maxPrice: 1000,
      sortBy: "price",
      sortOrder: "asc",
    });

    console.log("Search results:", response.data.products);
  } catch (error) {
    console.error("Search failed:", error);
  }
};
```

## 🎣 Sử dụng Custom Hooks

### 1. useAuth Hook

```typescript
import { useAuth } from "@/hooks/useAuth";

const LoginComponent = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    testConnection,
    testApi,
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login("john@example.com", "Password123", true);
      // Redirect hoặc update UI
    } catch (error) {
      // Error đã được handle trong hook
    }
  };

  const handleRegister = async () => {
    try {
      await register({
        fullName: "John Doe", // Theo RegisterRequest schema
        email: "john@example.com",
        password: "Password123",
      });
    } catch (error) {
      // Error đã được handle trong hook
    }
  };

  const handleTestConnection = async () => {
    const result = await testConnection();
    console.log("Connection test:", result);
  };

  const handleTestApi = async () => {
    const result = await testApi();
    console.log("API test:", result);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleTestConnection}>Test Connection</button>
          <button onClick={handleTestApi}>Test API</button>
        </div>
      )}
    </div>
  );
};
```

### 2. useProducts Hook

```typescript
import { useProducts } from "@/hooks/useProducts";

const ProductListComponent = () => {
  const {
    products,
    isLoading,
    error,
    pagination,
    getProducts,
    getFeaturedProducts,
  } = useProducts();

  useEffect(() => {
    // Load featured products khi component mount
    getFeaturedProducts(10);
  }, [getFeaturedProducts]);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      getProducts(undefined, pagination.page + 1, 20);
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Featured Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pagination && pagination.page < pagination.totalPages && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
};
```

## 🧪 Testing API với ApiTestComponent

Sử dụng component test để kiểm tra tất cả API endpoints dựa trên `API_DOCUMENTATION.md`:

```typescript
import ApiTestComponent from "@/components/ApiTestComponent";

// Trong component của bạn
const TestPage = () => {
  return (
    <div>
      <h1>API Testing</h1>
      <ApiTestComponent />
    </div>
  );
};
```

Component này sẽ cung cấp:

- ✅ Test backend connection (health endpoint)
- ✅ Test API endpoint (/test)
- ✅ Test /auth/register endpoint
- ✅ Test /auth/login endpoint
- ✅ Real-time test results
- ✅ Error handling và logging
- ✅ Form validation theo RegisterRequest schema

## 🛡️ Error Handling

Hệ thống có error handling tích hợp sẵn:

```typescript
import { HttpError } from "@/lib/http";

try {
  const response = await authService.login(credentials);
} catch (error) {
  if (error instanceof HttpError) {
    // HTTP error với status code và payload
    console.error(`HTTP ${error.statusCode}:`, error.payload);

    switch (error.statusCode) {
      case 401:
        // Unauthorized - redirect to login
        break;
      case 403:
        // Forbidden - show access denied
        break;
      case 500:
        // Server error - show generic error
        break;
      default:
        // Other errors
        break;
    }
  } else {
    // Network error hoặc error khác
    console.error("Network error:", error);
  }
}
```

## 🔄 Retry Mechanism

HTTP client có retry mechanism tích hợp:

```typescript
// Tự động retry 2 lần cho server errors (5xx)
const response = await authService.login(credentials, {
  timeout: 15000, // 15 seconds timeout
  retries: 2, // Retry 2 times
  retryDelay: 1000, // 1 second delay between retries
});
```

## 📱 TypeScript Support

Tất cả services và hooks đều có TypeScript types đầy đủ:

```typescript
// Product types
interface Product {
  _id: string;
  name: string;
  price: number;
  // ... other properties
}

// API response types
interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: PaginationInfo;
  };
  message: string;
}

// Service methods với type safety
const products: Product[] = await productService.getProducts();
```

## 🧪 Testing

### Health Check

```typescript
import { apiService } from "@/services/api.service";

// Kiểm tra backend có hoạt động không
const checkBackendHealth = async () => {
  try {
    const health = await apiService.healthCheck();
    console.log("Backend status:", health.status);
  } catch (error) {
    console.error("Backend is down:", error);
  }
};
```

### API Test

```typescript
// Test API endpoint
const testApi = async () => {
  try {
    const result = await apiService.testApi();
    console.log("API test result:", result);
  } catch (error) {
    console.error("API test failed:", error);
  }
};
```

### Test Connection với useAuth

```typescript
import { useAuth } from "@/hooks/useAuth";

const { testConnection, testApi } = useAuth();

const testBackend = async () => {
  const connectionResult = await testConnection();
  if (connectionResult.success) {
    console.log("✅ Backend is running:", connectionResult.message);
  } else {
    console.log("❌ Backend is down:", connectionResult.message);
  }

  const apiResult = await testApi();
  if (apiResult.success) {
    console.log("✅ API is working:", apiResult.message);
  } else {
    console.log("❌ API is down:", apiResult.message);
  }
};
```

## 🚀 Best Practices

### 1. Sử dụng Services thay vì gọi API trực tiếp

```typescript
// ✅ Good - Sử dụng service
const products = await productService.getProducts();

// ❌ Bad - Gọi API trực tiếp
const response = await fetch("/api/products");
const products = await response.json();
```

### 2. Sử dụng Custom Hooks cho state management

```typescript
// ✅ Good - Sử dụng hook
const { products, isLoading, getProducts } = useProducts();

// ❌ Bad - Quản lý state thủ công
const [products, setProducts] = useState([]);
const [isLoading, setIsLoading] = useState(false);
```

### 3. Error handling nhất quán

```typescript
// ✅ Good - Sử dụng try-catch với HttpError
try {
  const result = await service.method();
} catch (error) {
  if (error instanceof HttpError) {
    // Handle HTTP errors
  } else {
    // Handle other errors
  }
}
```

### 4. Timeout và retry configuration

```typescript
// ✅ Good - Cấu hình timeout và retry
const response = await service.method(data, {
  timeout: 10000, // 10 seconds
  retries: 2, // Retry 2 times
});

// ❌ Bad - Không có timeout
const response = await service.method(data);
```

## 🔧 Migration từ Legacy Code

Nếu bạn đang sử dụng `src/apiRequests/`, có thể migrate dần dần:

```typescript
// Legacy code
import { authApiRequest } from "@/apiRequests/auth";

// New code
import { authService } from "@/services/auth.service";

// Legacy
const response = await authApiRequest.login(credentials);

// New
const response = await authService.login(credentials);
```

## 📚 API Endpoints

Hệ thống hỗ trợ tất cả endpoints từ `API_DOCUMENTATION.md`:

- **Health & Test**: `/health`, `/test`
- **Authentication**: `/auth/*`
  - `/auth/register` - Đăng ký user (theo RegisterRequest schema)
  - `/auth/login` - Đăng nhập
  - `/auth/me` - Lấy thông tin user hiện tại
  - `/auth/change-password` - Đổi mật khẩu
  - `/auth/forgot-password` - Quên mật khẩu
  - `/auth/reset-password/:token` - Reset mật khẩu
  - `/auth/verify-email/:token` - Xác thực email
  - `/auth/refresh-token` - Refresh token
  - `/auth/logout` - Đăng xuất
- **Users**: `/users/*`
  - `/users/profile` - Quản lý profile
  - `/users/addresses` - Quản lý địa chỉ
- **Products**: `/products/*`
- **Categories**: `/categories/*`
- **Orders**: `/orders/*`
- **Cart**: `/cart/*`
- **Reviews**: `/reviews/*`
- **Admin**: `/admin/*`

## 🆘 Troubleshooting

### Common Issues

1. **CORS Error**: Đảm bảo backend có CORS configuration đúng
2. **Network Error**: Kiểm tra backend có chạy không
3. **Type Error**: Kiểm tra TypeScript types có match với backend response không
4. **Endpoint Error**: Kiểm tra endpoint có đúng không
5. **Schema Mismatch**: Đảm bảo request body khớp với RegisterRequest schema

### Debug Mode

```typescript
// Enable debug logging
console.log("🌐 API Request:", method, url);
console.log("📤 Request body:", body);
console.log("📥 Response:", response);
```

### Sử dụng ApiTestComponent để debug

```typescript
// Import và sử dụng component test
import ApiTestComponent from "@/components/ApiTestComponent";

// Component này sẽ giúp bạn:
// 1. Test backend connection (health endpoint)
// 2. Test API endpoint (/test)
// 3. Test từng endpoint riêng biệt
// 4. Xem real-time results
// 5. Debug API issues
```

### Kiểm tra backend với cURL

```bash
# Test health check endpoint từ API_DOCUMENTATION.md
curl -X GET http://localhost:8081/health

# Test API endpoint từ API_DOCUMENTATION.md
curl -X GET http://localhost:8081/api/v1/test

# Test register endpoint từ API_DOCUMENTATION.md
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'

# Test login endpoint từ API_DOCUMENTATION.md
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Checklist khắc phục lỗi

- [ ] Backend có đang chạy trên port 8081?
- [ ] CORS configuration có đúng?
- [ ] Environment variables có được set?
- [ ] API endpoints có tồn tại trong backend?
- [ ] Network request có được gửi đúng format?
- [ ] Request body có khớp với RegisterRequest schema?
- [ ] Sử dụng ApiTestComponent để test từng endpoint
- [ ] Kiểm tra /health và /test endpoints

## 📖 Tài liệu tham khảo

- [API Documentation](./API_DOCUMENTATION.md)
- [Backend Integration README](./BACKEND_INTEGRATION_README.md)
- [Node.js Backend Repository](link-to-backend-repo)

---

**Lưu ý**: Hệ thống này được thiết kế để tích hợp chính xác với Node.js backend dựa trên `API_DOCUMENTATION.md`. Đảm bảo backend đang chạy và có đúng API endpoints trước khi sử dụng frontend services.

**Để test API**: Sử dụng `ApiTestComponent` để kiểm tra tất cả endpoints và debug issues một cách dễ dàng. Component này được thiết kế để test chính xác theo `API_DOCUMENTATION.md` của bạn.

**Schema Validation**: Hệ thống sử dụng `RegisterRequest` schema với `fullName` field thay vì `firstName`/`lastName` để khớp với backend implementation.
