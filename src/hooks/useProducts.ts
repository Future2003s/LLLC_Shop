import { useState, useCallback, useEffect } from "react";
import {
  productService,
  Product,
  ProductListResponse,
  ProductFilters,
} from "@/services/product.service";
import { HttpError } from "@/lib/http";

// Product state interface
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

// Product actions interface
interface ProductActions {
  getProducts: (
    filters?: ProductFilters,
    page?: number,
    limit?: number
  ) => Promise<void>;
  getProductById: (productId: string) => Promise<void>;
  getProductBySlug: (slug: string) => Promise<void>;
  getFeaturedProducts: (limit?: number) => Promise<void>;
  getNewArrivals: (limit?: number) => Promise<void>;
  getProductsOnSale: (limit?: number) => Promise<void>;
  getPopularProducts: (limit?: number) => Promise<void>;
  getTrendingProducts: (limit?: number) => Promise<void>;
  getRelatedProducts: (productId: string, limit?: number) => Promise<void>;
  searchProducts: (
    query: string,
    filters?: Omit<ProductFilters, "search">,
    page?: number,
    limit?: number
  ) => Promise<void>;
  getProductsByCategory: (
    categoryId: string,
    filters?: Omit<ProductFilters, "category">,
    page?: number,
    limit?: number
  ) => Promise<void>;
  getProductsByBrand: (
    brand: string,
    filters?: Omit<ProductFilters, "brand">,
    page?: number,
    limit?: number
  ) => Promise<void>;
  getProductsInPriceRange: (
    minPrice: number,
    maxPrice: number,
    filters?: Omit<ProductFilters, "minPrice" | "maxPrice">,
    page?: number,
    limit?: number
  ) => Promise<void>;
  clearError: () => void;
  clearProducts: () => void;
}

// Combined product hook return type
type UseProductsReturn = ProductState & ProductActions;

export const useProducts = (): UseProductsReturn => {
  // State management
  const [productState, setProductState] = useState<ProductState>({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    pagination: null,
  });

  // Clear error
  const clearError = useCallback(() => {
    setProductState((prev) => ({ ...prev, error: null }));
  }, []);

  // Clear products
  const clearProducts = useCallback(() => {
    setProductState((prev) => ({
      ...prev,
      products: [],
      currentProduct: null,
      pagination: null,
    }));
  }, []);

  // Generic function to handle API calls
  const handleApiCall = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      updateState: (data: T) => Partial<ProductState>
    ) => {
      try {
        setProductState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await apiCall();

        setProductState((prev) => ({
          ...prev,
          ...updateState(response),
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof HttpError
            ? error.payload?.message || "API request failed"
            : "An unexpected error occurred";

        setProductState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    []
  );

  // Get all products with filters and pagination
  const getProducts = useCallback(
    async (filters?: ProductFilters, page: number = 1, limit: number = 20) => {
      await handleApiCall(
        () => productService.getProducts(filters, page, limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get product by ID
  const getProductById = useCallback(
    async (productId: string) => {
      await handleApiCall(
        () => productService.getProductById(productId),
        (response: any) => ({
          currentProduct: response.data,
        })
      );
    },
    [handleApiCall]
  );

  // Get product by slug
  const getProductBySlug = useCallback(
    async (slug: string) => {
      await handleApiCall(
        () => productService.getProductBySlug(slug),
        (response: any) => ({
          currentProduct: response.data,
        })
      );
    },
    [handleApiCall]
  );

  // Get featured products
  const getFeaturedProducts = useCallback(
    async (limit: number = 10) => {
      await handleApiCall(
        () => productService.getFeaturedProducts(limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get new arrivals
  const getNewArrivals = useCallback(
    async (limit: number = 10) => {
      await handleApiCall(
        () => productService.getNewArrivals(limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get products on sale
  const getProductsOnSale = useCallback(
    async (limit: number = 10) => {
      await handleApiCall(
        () => productService.getProductsOnSale(limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get popular products
  const getPopularProducts = useCallback(
    async (limit: number = 10) => {
      await handleApiCall(
        () => productService.getPopularProducts(limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get trending products
  const getTrendingProducts = useCallback(
    async (limit: number = 10) => {
      await handleApiCall(
        () => productService.getTrendingProducts(limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get related products
  const getRelatedProducts = useCallback(
    async (productId: string, limit: number = 6) => {
      await handleApiCall(
        () => productService.getRelatedProducts(productId, limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Search products
  const searchProducts = useCallback(
    async (
      query: string,
      filters?: Omit<ProductFilters, "search">,
      page: number = 1,
      limit: number = 20
    ) => {
      await handleApiCall(
        () => productService.searchProducts(query, filters, page, limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get products by category
  const getProductsByCategory = useCallback(
    async (
      categoryId: string,
      filters?: Omit<ProductFilters, "category">,
      page: number = 1,
      limit: number = 20
    ) => {
      await handleApiCall(
        () =>
          productService.getProductsByCategory(
            categoryId,
            filters,
            page,
            limit
          ),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get products by brand
  const getProductsByBrand = useCallback(
    async (
      brand: string,
      filters?: Omit<ProductFilters, "brand">,
      page: number = 1,
      limit: number = 20
    ) => {
      await handleApiCall(
        () => productService.getProductsByBrand(brand, filters, page, limit),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  // Get products in price range
  const getProductsInPriceRange = useCallback(
    async (
      minPrice: number,
      maxPrice: number,
      filters?: Omit<ProductFilters, "minPrice" | "maxPrice">,
      page: number = 1,
      limit: number = 20
    ) => {
      await handleApiCall(
        () =>
          productService.getProductsInPriceRange(
            minPrice,
            maxPrice,
            filters,
            page,
            limit
          ),
        (response: ProductListResponse) => ({
          products: response.data.products,
          pagination: response.data.pagination,
        })
      );
    },
    [handleApiCall]
  );

  return {
    ...productState,
    getProducts,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    getNewArrivals,
    getProductsOnSale,
    getPopularProducts,
    getTrendingProducts,
    getRelatedProducts,
    searchProducts,
    getProductsByCategory,
    getProductsByBrand,
    getProductsInPriceRange,
    clearError,
    clearProducts,
  };
};
