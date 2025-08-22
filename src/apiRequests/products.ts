import { http } from "@/lib/http";
import { API_CONFIG } from "@/lib/api-config";

// Product types based on backend model
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity: number;
  sold: number;
  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
    order: number;
    _id?: string;
  }>;
  // optional denormalized fields often returned by backend
  brandName?: string;
  categoryName?: string;
  // relations
  category:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };
  brand?:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };
  // optional variants (if the backend supports variant pricing)
  variants?: Array<{
    _id?: string;
    id?: string;
    name: string;
    price: number;
  }>;
  tags: string[];
  status: "active" | "draft" | "archived";
  featured: boolean;
  specifications?: Record<string, any>;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  message?: string;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  status?: "active" | "draft" | "archived";
  search?: string;
}

// Product API requests
export const productApiRequest = {
  // Get all products with filters
  getProducts: (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return http.get(`/products${queryString ? `?${queryString}` : ""}`);
  },

  // Get single product by ID
  getProduct: (id: string): Promise<ProductResponse> => {
    return http.get(API_CONFIG.PRODUCTS.BY_ID.replace(":id", id));
  },

  // Search products
  searchProducts: (
    query: string,
    page = 1,
    limit = 10
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    return http.get(`${API_CONFIG.PRODUCTS.SEARCH}?${params}`);
  },

  // Get featured products
  getFeaturedProducts: (): Promise<ProductsResponse> => {
    return http.get(API_CONFIG.PRODUCTS.FEATURED);
  },

  // Get products by category
  getProductsByCategory: (
    categoryId: string,
    params?: ProductQueryParams
  ): Promise<ProductsResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    const url = `/products/category/${categoryId}${
      queryString ? `?${queryString}` : ""
    }`;
    return http.get(url);
  },

  // Get products by brand
  getProductsByBrand: (
    brandId: string,
    params?: ProductQueryParams
  ): Promise<ProductsResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    const url = `/products/brand/${brandId}${
      queryString ? `?${queryString}` : ""
    }`;
    return http.get(url);
  },

  // Admin/Seller operations
  createProduct: (
    token: string,
    productData: Partial<Product>
  ): Promise<ProductResponse> => {
    return http.post("/products", productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateProduct: (
    token: string,
    id: string,
    productData: Partial<Product>
  ): Promise<ProductResponse> => {
    return http.put(`/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  deleteProduct: (
    token: string,
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateProductStock: (
    token: string,
    id: string,
    quantity: number
  ): Promise<ProductResponse> => {
    return http.put(
      `/products/${id}/stock`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};

// Helper function to build product image URL
export function getProductImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${imagePath}`;
}

// Helper function to format price
export function formatPrice(price: number, currency = "VND"): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  }).format(price);
}

// Helper function to calculate discount percentage
export function calculateDiscountPercentage(
  price: number,
  compareAtPrice?: number
): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
