import { httpClient, ApiResponse } from "@/lib/api/http-client";
import { envConfig } from "@/config";

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

// Helper functions to convert ApiResponse to expected types
const convertToProductsResponse = (
  response: ApiResponse<Product[]> | any
): ProductsResponse => {
  // Normalize various possible backend shapes
  try {
    // If raw array returned
    if (Array.isArray(response)) {
      return { success: true, message: "", data: response };
    }

    // If standard { success, data }
    if (response && typeof response === "object" && "success" in response) {
      const dataArr = Array.isArray(response.data)
        ? (response.data as Product[])
        : Array.isArray(response?.data?.items)
        ? (response.data.items as Product[])
        : Array.isArray(response?.data?.content)
        ? (response.data.content as Product[])
        : [];

      // Support pagination located at response.pagination, response.data.pagination, or response.data (page/size/totalElements/totalPages)
      const p =
        response.pagination ||
        response?.data?.pagination ||
        (response?.data &&
        ("page" in response.data ||
          "size" in response.data ||
          "total" in response.data ||
          "totalElements" in response.data ||
          "totalPages" in response.data)
          ? response.data
          : null);
      const pagination = p
        ? {
            page: Number(p.page ?? p.currentPage ?? 1),
            limit: Number(p.limit ?? p.size ?? p.pageSize ?? dataArr.length),
            total: Number(p.total ?? p.totalElements ?? 0),
            pages: Number(
              p.totalPages ??
                p.pages ??
                (p.total && (p.limit ?? p.size)
                  ? Math.ceil(p.total / (p.limit ?? p.size))
                  : 1)
            ),
          }
        : undefined;

      return {
        success: Boolean(response.success),
        message: response.message || "",
        data: dataArr,
        pagination,
      };
    }

    // If backend returns { data: [...] } without success
    if (response && typeof response === "object") {
      const dataArr = Array.isArray(response.data)
        ? (response.data as Product[])
        : Array.isArray(response?.data?.items)
        ? (response.data.items as Product[])
        : [];

      const p = response.pagination || response?.data?.pagination || null;
      const pagination = p
        ? {
            page: Number(p.page ?? p.currentPage ?? 1),
            limit: Number(p.limit ?? p.size ?? p.pageSize ?? dataArr.length),
            total: Number(p.total ?? p.totalElements ?? 0),
            pages: Number(
              p.totalPages ??
                p.pages ??
                (p.total && p.limit ? Math.ceil(p.total / p.limit) : 1)
            ),
          }
        : undefined;

      return { success: true, message: "", data: dataArr, pagination };
    }
  } catch (e) {
    console.warn("convertToProductsResponse: parse warning", e);
  }

  // Fallback
  return { success: false, message: "", data: [] };
};

const convertToProductResponse = (
  response: ApiResponse<Product> | any
): ProductResponse => {
  // Accept both { success, data } and raw product object
  if (response && typeof response === "object" && "success" in response) {
    const data = (response as ApiResponse<Product>).data as Product;
    return {
      success: Boolean((response as ApiResponse<Product>).success),
      message: (response as ApiResponse<Product>).message || "",
      data: data,
    };
  }
  // Fallback: backend returned the product directly
  return {
    success: true,
    message: "",
    data: response as Product,
  };
};

const convertToDeleteResponse = (
  response: ApiResponse<any>
): { success: boolean; message: string } => ({
  success: response.success || false,
  message: response.message || "Operation completed",
});

// Product API requests
export const productApiRequest = {
  // Get all products with filters
  getProducts: (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return httpClient
      .get(`/products${queryString ? `?${queryString}` : ""}`)
      .then(convertToProductsResponse);
  },

  // Get single product by ID
  getProduct: (id: string): Promise<ProductResponse> => {
    return httpClient.get(`/products/${id}`).then(convertToProductResponse);
  },

  // Search products
  searchProducts: (
    query: string,
    filters?: Partial<ProductQueryParams>
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      q: query,
      ...(filters && {
        page: filters.page?.toString() || "1",
        limit: filters.limit?.toString() || "20",
      }),
    });
    return httpClient
      .get(`/products/search?${params}`)
      .then(convertToProductsResponse);
  },

  // Get featured products
  getFeaturedProducts: (): Promise<ProductsResponse> => {
    return httpClient.get(`/products/featured`).then(convertToProductsResponse);
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
    return httpClient.get(url).then(convertToProductsResponse);
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
    return httpClient.get(url).then(convertToProductsResponse);
  },

  // Admin/Seller operations
  createProduct: (
    token: string,
    productData: Partial<Product>
  ): Promise<ProductResponse> => {
    return httpClient
      .post(`/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(convertToProductResponse);
  },

  updateProduct: async (
    token: string,
    id: string,
    productData: Partial<Product>
  ): Promise<ProductResponse> => {
    // Route through Next API to avoid CORS and ensure auth via cookies
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(productData),
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const text = await res.text();
    const data =
      contentType.includes("application/json") && text
        ? JSON.parse(text)
        : (text as any);

    const apiResp: ApiResponse<Product> =
      data && typeof data === "object" && "success" in data
        ? (data as ApiResponse<Product>)
        : { success: res.ok, data: data as Product };

    return convertToProductResponse(apiResp);
  },

  deleteProduct: (
    token: string,
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return httpClient
      .delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(convertToDeleteResponse);
  },

  updateProductStock: (
    token: string,
    id: string,
    quantity: number
  ): Promise<ProductResponse> => {
    return httpClient
      .put(
        `/products/${id}/stock`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(convertToProductResponse);
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
