// API Configuration for Node.js Backend Integration
// Based on API_DOCUMENTATION.md
export const API_CONFIG = {
  // Base URLs
  BACKEND_BASE_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081",
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",

  // Full API base URL
  get API_BASE_URL() {
    return `${this.BACKEND_BASE_URL}/api/${this.API_VERSION}`;
  },

  // Health check endpoint
  HEALTH: "/health",

  // Test endpoint
  TEST: "/test",

  // Auth endpoints - matching backend exactly from API_DOCUMENTATION.md
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

  // User endpoints - matching backend exactly from API_DOCUMENTATION.md
  USERS: {
    PROFILE: "/users/profile",
    ADDRESSES: "/users/addresses",
    ADDRESS_BY_ID: "/users/addresses/:addressId",
    SET_DEFAULT_ADDRESS: "/users/addresses/:addressId/default",
    PREFERENCES: "/users/preferences",
    AVATAR: "/users/avatar",
    ACCOUNT: "/users/account",
  },

  // Product endpoints - matching backend exactly
  PRODUCTS: {
    ALL: "/products",
    BY_ID: "/products/:id",
    BY_CATEGORY: "/products/category/:categoryId",
    BY_BRAND: "/products/brand/:brandId",
    SEARCH: "/products/search",
    FEATURED: "/products/featured",
  },

  // Cart endpoints - matching backend exactly
  CART: {
    GET: "/cart",
    ADD_ITEM: "/cart/items",
    UPDATE_ITEM: "/cart/items/:productId",
    REMOVE_ITEM: "/cart/items/:productId",
    CLEAR: "/cart/clear",
    COUNT: "/cart/count",
    SUMMARY: "/cart/summary",
    VALIDATE: "/cart/validate",
    APPLY_COUPON: "/cart/coupon",
    REMOVE_COUPON: "/cart/coupon",
  },

  // Order endpoints - matching backend exactly
  ORDERS: {
    CREATE: "/orders",
    USER_ORDERS: "/orders",
    BY_ID: "/orders/:id",
    CANCEL: "/orders/:id/cancel",
    TRACKING: "/orders/:id/tracking",
    ALL: "/orders/admin/all", // Admin only
    UPDATE_STATUS: "/orders/:id/status", // Admin only
    INVOICE: "/orders/:id/invoice",
    SHIPPING_LABEL: "/orders/:id/shipping-label",
  },

  // Category endpoints - matching backend exactly
  CATEGORIES: {
    ALL: "/categories",
    BY_ID: "/categories/:id",
    BY_SLUG: "/categories/slug/:slug",
    TREE: "/categories/tree",
  },

  // Review endpoints - matching backend exactly
  REVIEWS: {
    PRODUCT_REVIEWS: "/reviews/product/:productId",
    USER_REVIEWS: "/reviews/user",
    CREATE: "/reviews",
    UPDATE: "/reviews/:id",
    DELETE: "/reviews/:id",
    MARK_HELPFUL: "/reviews/:id/helpful",
    STATS: "/reviews/product/:productId/stats",
    ALL: "/reviews", // Admin only
    VERIFY: "/reviews/:id/verify", // Admin only
    REPORT: "/reviews/:id/report",
  },

  // Admin endpoints - matching backend exactly
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    USER_BY_ID: "/admin/users/:id",
    PRODUCTS: "/admin/products",
    PRODUCT_BY_ID: "/admin/products/:id",
    ORDERS: "/admin/orders",
    ORDER_BY_ID: "/admin/orders/:id",
    CATEGORIES: "/admin/categories",
    CATEGORY_BY_ID: "/admin/categories/:id",
    ANALYTICS: "/admin/analytics",
    SETTINGS: "/admin/settings",
    REPORTS: "/admin/reports",
    TRANSLATIONS: "/admin/translations",
    TRANSLATION_BY_KEY: "/admin/translations/:key",
  },

  // Translation endpoints
  TRANSLATIONS: {
    BY_KEY: "/translations/:key",
    BY_KEYS: "/translations/keys",
    BY_CATEGORY: "/translations/category/:category",
    ALL: "/translations",
    SEARCH: "/translations/search",
    STATS: "/translations/stats",
    EXPORT: "/translations/export",
    IMPORT: "/translations/import",
  },

  // Additional endpoints for e-commerce
  COUPONS: {
    VALIDATE: "/coupons/validate",
    APPLY: "/coupons/apply",
    ALL: "/coupons",
    BY_CODE: "/coupons/:code",
  },

  PAYMENTS: {
    CREATE_INTENT: "/payments/create-intent",
    CONFIRM: "/payments/confirm",
    WEBHOOK: "/payments/webhook",
    METHODS: "/payments/methods",
  },

  SHIPPING: {
    RATES: "/shipping/rates",
    TRACK: "/shipping/track/:trackingNumber",
    ZONES: "/shipping/zones",
  },

  NOTIFICATIONS: {
    SUBSCRIBE: "/notifications/subscribe",
    UNSUBSCRIBE: "/notifications/unsubscribe",
    PREFERENCES: "/notifications/preferences",
    MARK_READ: "/notifications/:id/read",
  },
};

// Enhanced helper function to build full API URLs
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string | number>
): string {
  let url = `${API_CONFIG.API_BASE_URL}${endpoint}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }

  return url;
}

// Enhanced helper function to get auth headers
export function getAuthHeaders(
  token: string,
  additionalHeaders?: Record<string, string>
): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json; charset=utf-8",
    ...additionalHeaders,
  };
}

// Helper function to get common headers
export function getCommonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json; charset=utf-8",
  };
}

// Helper function to build query string
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// Helper function to build full URL with query parameters
export function buildFullUrl(
  endpoint: string,
  pathParams?: Record<string, string | number>,
  queryParams?: Record<string, any>
): string {
  const baseUrl = buildApiUrl(endpoint, pathParams);
  const queryString = queryParams ? buildQueryString(queryParams) : "";
  return `${baseUrl}${queryString}`;
}
