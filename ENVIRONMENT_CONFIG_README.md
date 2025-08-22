# 🌍 Environment Configuration Guide

## 📋 Overview

Project này sử dụng file `.env.local` để cấu hình môi trường development và production một cách linh hoạt.

## 🚀 Cách hoạt động

### Development Mode (`NEXT_PUBLIC_IS_PRODUCTION=false`)

- Sử dụng các biến môi trường development
- API calls đi đến `http://localhost:8081`
- Frontend chạy tại `http://localhost:3000`

### Production Mode (`NEXT_PUBLIC_IS_PRODUCTION=true`)

- Sử dụng các biến môi trường production
- API calls đi đến `https://api.lalalycheee.vn`
- Frontend chạy tại `https://lalalycheee.vn`

## 📁 File cấu hình

### `.env.local` (Development)

```bash
# Production flag
NEXT_PUBLIC_IS_PRODUCTION=false

# Development URLs
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_API_END_POINT=http://localhost:8081/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081

# Production URLs (không được sử dụng khi development)
NEXT_PUBLIC_URL_PRODUCTION=https://lalalycheee.vn
NEXT_PUBLIC_API_END_POINT_PRODUCTION=https://api.lalalycheee.vn/api/v1
NEXT_PUBLIC_BACKEND_URL_PRODUCTION=https://api.lalalycheee.vn
```

### `.env.production` (Production - tùy chọn)

```bash
# Production flag
NEXT_PUBLIC_IS_PRODUCTION=true

# Development URLs (không được sử dụng khi production)
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_API_END_POINT=http://localhost:8081/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081

# Production URLs
NEXT_PUBLIC_URL_PRODUCTION=https://lalalycheee.vn
NEXT_PUBLIC_API_END_POINT_PRODUCTION=https://api.lalalycheee.vn/api/v1
NEXT_PUBLIC_BACKEND_URL_PRODUCTION=https://api.lalalycheee.vn
```

## 🔄 Chuyển đổi môi trường

### Development → Production

1. Mở file `.env.local`
2. Thay đổi `NEXT_PUBLIC_IS_PRODUCTION=false` thành `true`
3. Restart development server

### Production → Development

1. Mở file `.env.local`
2. Thay đổi `NEXT_PUBLIC_IS_PRODUCTION=true` thành `false`
3. Restart development server

## 🧪 Test cấu hình

### Kiểm tra môi trường hiện tại

```bash
# Mở browser console
# Xem log: "✅ Using development/production config:"
```

### Test API endpoint

```bash
# Development
curl http://localhost:8081/api/v1/health

# Production
curl https://api.lalalycheee.vn/api/v1/health
```

## 📝 Các biến môi trường quan trọng

### Frontend

- `NEXT_PUBLIC_URL` - URL của frontend
- `NEXT_PUBLIC_URL_LOGO` - URL của logo
- `NEXT_PUBLIC_API_VERSION` - Version của API

### Backend

- `NEXT_PUBLIC_API_END_POINT` - Endpoint chính của API
- `NEXT_PUBLIC_BACKEND_URL` - URL của backend

### Database

- `DATABASE_URL_DEV` - MongoDB URL cho development
- `DATABASE_URL_PROD` - MongoDB URL cho production

### Redis

- `REDIS_URL_DEV` - Redis URL cho development
- `REDIS_URL_PROD` - Redis URL cho production

### Security

- `JWT_SECRET` - Secret key cho JWT
- `SESSION_TIMEOUT` - Thời gian timeout của session
- `REFRESH_TOKEN_TIMEOUT` - Thời gian timeout của refresh token

## 🚨 Lưu ý quan trọng

1. **Không commit file `.env.local`** vào Git
2. **File `.env.local` có priority cao nhất**
3. **Restart server** sau khi thay đổi biến môi trường
4. **Kiểm tra console** để xác nhận môi trường đang sử dụng

## 🔧 Troubleshooting

### Lỗi "Config validation failed"

- Kiểm tra tất cả biến môi trường bắt buộc đã được set
- Kiểm tra format của URL (phải bắt đầu với http:// hoặc https://)

### API calls không hoạt động

- Kiểm tra `NEXT_PUBLIC_IS_PRODUCTION` đã đúng chưa
- Kiểm tra backend có đang chạy không
- Kiểm tra CORS configuration trên backend

### Không thấy log config

- Kiểm tra file `.env.local` có tồn tại không
- Kiểm tra tên biến môi trường có đúng không
- Restart development server

## 📚 Tham khảo

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Environment Variables Best Practices](https://nextjs.org/docs/basic-features/environment-variables#environment-variables-best-practices)
