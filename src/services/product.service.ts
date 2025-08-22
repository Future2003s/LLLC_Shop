import { ApiService } from "./api.service";
import { API_CONFIG } from "@/lib/api-config";

// Product types matching backend
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  rating: number;
  reviewCount: number;
  slug: string;
  tags: string[];
  specifications: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  search?: string;
  sortBy?: "price" | "name" | "rating" | "createdAt" | "popularity";
  sortOrder?: "asc" | "desc";
}

// Product Service extending ApiService
export class ProductService extends ApiService {
  // Get all products with filters and pagination
  async getProducts(
    filters?: ProductFilters,
    page: number = 1,
    limit: number = 20,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    };

    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.ALL,
      undefined,
      queryParams,
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Get product by ID
  async getProductById(
    productId: string,
    token?: string
  ): Promise<ProductResponse> {
    return this.get<ProductResponse>(
      API_CONFIG.PRODUCTS.BY_ID,
      { id: productId },
      undefined,
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Get product by slug
  async getProductBySlug(
    slug: string,
    token?: string
  ): Promise<ProductResponse> {
    const queryParams = { q: slug, page: "1", limit: "1" } as const;
    const search = await this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.SEARCH,
      undefined,
      queryParams,
      { token, timeout: 8000, retries: 1 }
    );
    const product = search?.data?.products?.[0];
    return {
      success: Boolean(product),
      data: product as Product,
      message: product ? "OK" : "Not found",
    };
  }

  // Get featured products
  async getFeaturedProducts(
    limit: number = 10,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = { limit: limit.toString() };

    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.FEATURED,
      undefined,
      queryParams,
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Get new arrivals
  async getNewArrivals(
    limit: number = 10,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      limit: limit.toString(),
      sort: "createdAt",
      order: "desc",
    } as const;
    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.ALL,
      undefined,
      queryParams,
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Get products on sale
  async getProductsOnSale(
    limit: number = 10,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = { limit: limit.toString(), onSale: true as any } as any;
    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.ALL,
      undefined,
      queryParams,
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Get popular products
  async getPopularProducts(
    limit: number = 10,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      limit: limit.toString(),
      sort: "sold",
      order: "desc",
    } as const;
    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.ALL,
      undefined,
      queryParams,
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Get trending products
  async getTrendingProducts(
    limit: number = 10,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      limit: limit.toString(),
      sort: "sold",
      order: "desc",
    } as const;
    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.ALL,
      undefined,
      queryParams,
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Get related products
  async getRelatedProducts(
    productId: string,
    limit: number = 6,
    token?: string
  ): Promise<ProductListResponse> {
    // Fallback: get product then fetch same-category products
    const current = await this.getProductById(productId, token);
    const categoryId =
      (current?.data?.category as any)?._id || (current?.data?.category as any);
    if (!categoryId) {
      return this.get<ProductListResponse>(
        API_CONFIG.PRODUCTS.ALL,
        undefined,
        { limit: limit.toString() },
        { token, timeout: 8000, retries: 1 }
      );
    }
    const list = await this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.BY_CATEGORY,
      { categoryId },
      { limit: (limit + 1).toString() },
      { token, timeout: 8000, retries: 1 }
    );
    // Filter out current product if present
    if (list?.data?.products) {
      list.data.products = list.data.products
        .filter((p) => p._id !== productId)
        .slice(0, limit);
    }
    return list;
  }

  // Search products
  async searchProducts(
    query: string,
    filters?: Omit<ProductFilters, "search">,
    page: number = 1,
    limit: number = 20,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    } as any;

    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.SEARCH,
      undefined,
      queryParams,
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Get products by category
  async getProductsByCategory(
    categoryId: string,
    filters?: Omit<ProductFilters, "category">,
    page: number = 1,
    limit: number = 20,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    } as any;

    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.BY_CATEGORY,
      { categoryId },
      queryParams,
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Get products by brand
  async getProductsByBrand(
    brand: string,
    filters?: Omit<ProductFilters, "brand">,
    page: number = 1,
    limit: number = 20,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    } as any;

    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.BY_BRAND,
      { brandId: brand },
      queryParams,
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Get products in price range
  async getProductsInPriceRange(
    minPrice: number,
    maxPrice: number,
    filters?: Omit<ProductFilters, "minPrice" | "maxPrice">,
    page: number = 1,
    limit: number = 20,
    token?: string
  ): Promise<ProductListResponse> {
    const queryParams = {
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    };

    return this.get<ProductListResponse>(
      API_CONFIG.PRODUCTS.ALL,
      undefined,
      queryParams,
      { token, timeout: 10000, retries: 1 }
    );
  }
}

// Export singleton instance
export const productService = new ProductService();
