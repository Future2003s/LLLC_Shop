# Backend API Integration Guide

## Overview

This document provides a comprehensive guide for integrating the Node.js backend (d:/WorkSpace/nodejsBackEnd) with the Next.js frontend (d:/WorkSpace/clientCompany).

## Backend API Structure

### Base URL Configuration

- Backend Server: `http://localhost:8081`
- API Version: `v1`
- Full API Base: `http://localhost:8081/api/v1`

### API Response Format

All backend API responses follow this structure:

```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  timestamp?: string,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

## Authentication Flow

### 1. User Registration

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "customer",
      "isActive": true,
      "isEmailVerified": true,
      "addresses": [],
      "preferences": {
        "language": "en",
        "currency": "USD",
        "notifications": {
          "email": true,
          "sms": false,
          "push": true
        }
      }
    },
    "token": "JWT_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
```

### 2. User Login

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "customer|admin|seller",
      "isActive": true,
      "isEmailVerified": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "addresses": [],
      "preferences": {
        "language": "en",
        "currency": "USD",
        "notifications": {
          "email": true,
          "sms": false,
          "push": true
        }
      }
    },
    "token": "JWT_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
```

### 3. Get Current User

**Endpoint:** `GET /api/v1/auth/me`
**Headers:** `Authorization: Bearer {token}`

**Response:**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "customer|admin|seller",
    "avatar": "string",
    "addresses": [],
    "preferences": {
      "language": "en",
      "currency": "USD",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true
      }
    }
  }
}
```

### 4. Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh-token`

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "NEW_JWT_TOKEN",
    "refreshToken": "NEW_REFRESH_TOKEN"
  }
}
```

### 5. Logout

**Endpoint:** `POST /api/v1/auth/logout`
**Headers:** `Authorization: Bearer {token}`

**Request Body (optional):**

```json
{
  "refreshToken": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 6. Change Password

**Endpoint:** `PUT /api/v1/auth/change-password`
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 7. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request Body:**

```json
{
  "email": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 8. Reset Password

**Endpoint:** `PUT /api/v1/auth/reset-password/{token}`

**Request Body:**

```json
{
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "user": {...},
    "token": "JWT_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
```

## User Management

### 1. Get User Profile

**Endpoint:** `GET /api/v1/users/profile`
**Headers:** `Authorization: Bearer {token}`

### 2. Update User Profile

**Endpoint:** `PUT /api/v1/users/profile`
**Headers:** `Authorization: Bearer {token}`

### 3. User Addresses

- **Get Addresses:** `GET /api/v1/users/addresses`
- **Add Address:** `POST /api/v1/users/addresses`
- **Update Address:** `PUT /api/v1/users/addresses/{addressId}`
- **Delete Address:** `DELETE /api/v1/users/addresses/{addressId}`
- **Set Default:** `PUT /api/v1/users/addresses/{addressId}/default`

## Product Management

### 1. Get Products (Public)

**Endpoint:** `GET /api/v1/products`

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field
- `order`: Sort order (asc/desc)
- `category`: Filter by category
- `brand`: Filter by brand
- `minPrice`: Minimum price
- `maxPrice`: Maximum price

### 2. Get Single Product

**Endpoint:** `GET /api/v1/products/{id}`

### 3. Search Products

**Endpoint:** `GET /api/v1/products/search`

**Query Parameters:**

- `q`: Search query
- `page`: Page number
- `limit`: Items per page

### 4. Featured Products

**Endpoint:** `GET /api/v1/products/featured`

### 5. Products by Category

**Endpoint:** `GET /api/v1/products/category/{categoryId}`

### 6. Products by Brand

**Endpoint:** `GET /api/v1/products/brand/{brandId}`

### Admin/Seller Product Operations

- **Create Product:** `POST /api/v1/products` (Admin/Seller only)
- **Update Product:** `PUT /api/v1/products/{id}` (Admin/Seller only)
- **Delete Product:** `DELETE /api/v1/products/{id}` (Admin/Seller only)
- **Update Stock:** `PUT /api/v1/products/{id}/stock` (Admin/Seller only)

## Cart Management

### 1. Get Cart

**Endpoint:** `GET /api/v1/cart`
**Headers:** `Authorization: Bearer {token}`

### 2. Add to Cart

**Endpoint:** `POST /api/v1/cart/items`
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "productId": "string",
  "quantity": 1
}
```

### 3. Update Cart Item

**Endpoint:** `PUT /api/v1/cart/items/{productId}`
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "quantity": 2
}
```

### 4. Remove from Cart

**Endpoint:** `DELETE /api/v1/cart/items/{productId}`
**Headers:** `Authorization: Bearer {token}`

### 5. Clear Cart

**Endpoint:** `DELETE /api/v1/cart/clear`
**Headers:** `Authorization: Bearer {token}`

## Order Management

### 1. Get User Orders

**Endpoint:** `GET /api/v1/orders`
**Headers:** `Authorization: Bearer {token}`

### 2. Get Single Order

**Endpoint:** `GET /api/v1/orders/{id}`
**Headers:** `Authorization: Bearer {token}`

### 3. Create Order

**Endpoint:** `POST /api/v1/orders`
**Headers:** `Authorization: Bearer {token}`

### 4. Cancel Order

**Endpoint:** `PUT /api/v1/orders/{id}/cancel`
**Headers:** `Authorization: Bearer {token}`

### Admin Order Operations

- **Get All Orders:** `GET /api/v1/orders/admin/all` (Admin only)
- **Update Order Status:** `PUT /api/v1/orders/{id}/status` (Admin only)

## Categories

### 1. Get All Categories

**Endpoint:** `GET /api/v1/categories`

### 2. Get Category by ID

**Endpoint:** `GET /api/v1/categories/{id}`

## Brands

### 1. Get All Brands

**Endpoint:** `GET /api/v1/brands`

### 2. Get Brand by ID

**Endpoint:** `GET /api/v1/brands/{id}`

## Reviews

### 1. Get Product Reviews

**Endpoint:** `GET /api/v1/reviews/product/{productId}`

### 2. Create Review

**Endpoint:** `POST /api/v1/reviews`
**Headers:** `Authorization: Bearer {token}`

### 3. Update Review

**Endpoint:** `PUT /api/v1/reviews/{id}`
**Headers:** `Authorization: Bearer {token}`

### 4. Delete Review

**Endpoint:** `DELETE /api/v1/reviews/{id}`
**Headers:** `Authorization: Bearer {token}`

## Analytics (Admin Only)

### 1. Get Analytics Summary

**Endpoint:** `GET /api/v1/analytics/summary`
**Headers:** `Authorization: Bearer {token}`

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

The backend implements rate limiting for different endpoints:

- **Auth endpoints:** 5 requests per minute
- **General endpoints:** 100 requests per minute
- **Search endpoints:** 20 requests per minute
- **Admin endpoints:** 50 requests per minute

## Security Headers

All requests should include:

- `Content-Type: application/json`
- `Authorization: Bearer {token}` (for protected routes)

## CORS Configuration

The backend is configured to accept requests from:

- `http://localhost:3000` (Development)
- Production domains (to be configured)

## Environment Variables

Frontend `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_API_VERSION=v1
```

## Integration Steps

1. **Update Environment Variables**

   - Set `NEXT_PUBLIC_BACKEND_URL` to backend server URL
   - Set `NEXT_PUBLIC_API_VERSION` to `v1`

2. **Update API Request Handlers**

   - Ensure all API requests use the correct backend endpoints
   - Handle response format properly

3. **Update Authentication Flow**

   - Store JWT token and refresh token in cookies
   - Include Authorization header in protected routes
   - Implement token refresh logic

4. **Handle Errors**

   - Parse backend error responses
   - Display appropriate error messages to users

5. **Test Integration**
   - Test authentication flow
   - Test CRUD operations
   - Test error handling
   - Test token refresh

## Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Token refresh
- [ ] User logout
- [ ] Get user profile
- [ ] Update user profile
- [ ] Product listing
- [ ] Product search
- [ ] Cart operations
- [ ] Order creation
- [ ] Admin operations (if applicable)

## Notes

1. The backend uses MongoDB for data storage
2. Passwords are hashed using bcrypt
3. JWT tokens expire after a configured time (check backend config)
4. Email verification is currently disabled (users are auto-verified)
5. The backend includes caching for better performance
6. Rate limiting is implemented to prevent abuse
