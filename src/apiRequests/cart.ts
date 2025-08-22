import { http } from "@/lib/http";
import { API_CONFIG } from "@/lib/api-config";

// Cart types based on backend model
export interface CartItem {
  product:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
        price: number;
        compareAtPrice?: number;
        images: string[];
        sku: string;
        quantity: number; // available quantity
      };
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  coupon?: {
    code: string;
    discount: number;
    type: "percentage" | "fixed";
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: Cart;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CartSummaryResponse {
  success: boolean;
  message?: string;
  data: CartSummary;
}

export interface CartCountResponse {
  success: boolean;
  message?: string;
  data: {
    count: number;
  };
}

export interface CartValidationResponse {
  success: boolean;
  message?: string;
  data: {
    valid: boolean;
    errors?: Array<{
      productId: string;
      message: string;
      availableQuantity?: number;
    }>;
  };
}

// Cart API requests
export const cartApiRequest = {
  // Get cart
  getCart: (token: string): Promise<CartResponse> => {
    return http.get(API_CONFIG.CART.GET, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Add item to cart
  addItem: (
    token: string,
    productId: string,
    quantity: number = 1
  ): Promise<CartResponse> => {
    return http.post(
      API_CONFIG.CART.ADD_ITEM,
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Update cart item quantity
  updateItem: (
    token: string,
    productId: string,
    quantity: number
  ): Promise<CartResponse> => {
    return http.put(
      API_CONFIG.CART.UPDATE_ITEM.replace(":productId", productId),
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Remove item from cart
  removeItem: (token: string, productId: string): Promise<CartResponse> => {
    return http.delete(
      API_CONFIG.CART.REMOVE_ITEM.replace(":productId", productId),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Clear cart
  clearCart: (
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete(API_CONFIG.CART.CLEAR, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get cart item count
  getCartCount: (token: string): Promise<CartCountResponse> => {
    return http.get(API_CONFIG.CART.COUNT, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get cart summary
  getCartSummary: (token: string): Promise<CartSummaryResponse> => {
    return http.get(API_CONFIG.CART.SUMMARY, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Validate cart (check stock availability)
  validateCart: (token: string): Promise<CartValidationResponse> => {
    return http.get(API_CONFIG.CART.VALIDATE, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Apply coupon
  applyCoupon: (token: string, code: string): Promise<CartResponse> => {
    return http.post(
      "/cart/coupon",
      { code },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Remove coupon
  removeCoupon: (token: string): Promise<CartResponse> => {
    return http.delete("/cart/coupon", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Helper function to calculate cart totals
export function calculateCartTotals(items: CartItem[]): {
  subtotal: number;
  itemCount: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, itemCount };
}

// Helper function to check if product is in cart
export function isProductInCart(cart: Cart, productId: string): boolean {
  return cart.items.some((item) => {
    const id =
      typeof item.product === "string" ? item.product : item.product._id;
    return id === productId;
  });
}

// Helper function to get cart item by product ID
export function getCartItem(
  cart: Cart,
  productId: string
): CartItem | undefined {
  return cart.items.find((item) => {
    const id =
      typeof item.product === "string" ? item.product : item.product._id;
    return id === productId;
  });
}

// Helper function to format cart price
export function formatCartPrice(price: number, currency = "VND"): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  }).format(price);
}

// Helper function to calculate discount amount
export function calculateDiscountAmount(
  subtotal: number,
  coupon?: Cart["coupon"]
): number {
  if (!coupon) return 0;

  if (coupon.type === "percentage") {
    return (subtotal * coupon.discount) / 100;
  }

  return Math.min(coupon.discount, subtotal);
}
