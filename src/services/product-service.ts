/**
 * Product Service
 * Enterprise-level product management service with caching and validation
 */

import { BaseService } from "@/lib/api/base-service";
import { cacheService } from "@/lib/cache/cache-service";
import { validator } from "@/lib/validation/validator";
import { ValidationError } from "@/lib/errors/types";
import { z } from "zod";
import { httpClient } from "@/lib/api/http-client";
import { API_CONFIG } from "@/lib/api-config";

// Product types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  category: string;
  brand: string;
  tags: string[];
  images: string[];
  variants?: ProductVariant[];
  inventory: {
    quantity: number;
    lowStockThreshold?: number;
    trackQuantity: boolean;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status: "active" | "inactive" | "draft";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  inventory: {
    quantity: number;
    trackQuantity: boolean;
    lowStockThreshold?: number;
  };
  attributes: Record<string, string>;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  status?: string;
  search?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  category: string;
  brand: string;
  tags?: string[];
  images?: string[];
  variants?: Omit<ProductVariant, "_id">[];
  inventory: {
    quantity: number;
    lowStockThreshold?: number;
    trackQuantity?: boolean;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status?: "active" | "inactive" | "draft";
  featured?: boolean;
}

// Validation schemas
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name too long"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive("Sale price must be positive").optional(),
  sku: z.string().min(1, "SKU is required").max(50, "SKU too long"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  inventory: z.object({
    quantity: z.number().min(0, "Quantity cannot be negative"),
    lowStockThreshold: z
      .number()
      .min(0, "Low stock threshold cannot be negative")
      .optional(),
    trackQuantity: z.boolean().optional(),
  }),
  seo: z
    .object({
      title: z.string().max(60, "SEO title too long").optional(),
      description: z.string().max(160, "SEO description too long").optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  status: z.enum(["active", "inactive", "draft"]).optional(),
  featured: z.boolean().optional(),
});

class ProductService extends BaseService<Product> {
  constructor() {
    super("products", {
      baseUrl: "/products",
      cacheService,
      enableAudit: true,
      defaultCacheTtl: 600, // 10 minutes for products
    });
  }

  /**
   * Get products with advanced filtering
   */
  async getProducts(
    filters: ProductFilters & { page?: number; limit?: number } = {}
  ) {
    const { page = 1, limit = 20, ...filterParams } = filters;

    return this.list({
      page,
      limit,
      ...filterParams,
    });
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10) {
    const cacheKey = `featured-products:${limit}`;

    // Try cache first
    const cached = await cacheService.get<Product[]>(cacheKey);
    if (cached) {
      return {
        data: cached,
        success: true,
        meta: { cached: true, source: "cache", duration: 0 },
      };
    }

    // Use backend featured endpoint for correct filtering and caching
    const resp = await httpClient.get<Product[]>(
      `${API_CONFIG.PRODUCTS.FEATURED}?limit=${limit}`
    );
    const result = {
      data: resp.data || [],
      success: resp.success,
      meta: { cached: false, source: "api", duration: 0 },
    } as const;

    // Cache featured products for 30 minutes
    if (result.success && result.data) {
      await cacheService.set(cacheKey, result.data, 1800);
    }

    return result;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: string,
    options: { page?: number; limit?: number } = {}
  ) {
    const params = new URLSearchParams();
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));
    const url = `${API_CONFIG.PRODUCTS.BY_CATEGORY.replace(
      ":categoryId",
      categoryId
    )}${params.toString() ? `?${params.toString()}` : ""}`;

    const resp = await httpClient.get<Product[]>(url);
    return {
      data: resp.data || [],
      success: resp.success,
      meta: { cached: false, source: "api", duration: 0 },
    } as const;
  }

  /**
   * Search products
   */
  async searchProducts(
    query: string,
    options: { page?: number; limit?: number } = {}
  ) {
    if (!query.trim()) {
      return {
        data: [],
        success: true,
        meta: { cached: false, source: "empty-query", duration: 0 },
      };
    }

    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));

    const resp = await httpClient.get<Product[]>(
      `${API_CONFIG.PRODUCTS.SEARCH}?${params.toString()}`
    );
    return {
      data: resp.data || [],
      success: resp.success,
      meta: { cached: false, source: "api", duration: 0 },
    } as const;
  }

  /**
   * Get product recommendations
   */
  async getRecommendations(productId: string, limit: number = 5) {
    const cacheKey = `recommendations:${productId}:${limit}`;

    // Try cache first
    const cached = await cacheService.get<Product[]>(cacheKey);
    if (cached) {
      return {
        data: cached,
        success: true,
        meta: { cached: true, source: "cache", duration: 0 },
      };
    }

    // Get the current product to find similar ones
    const currentProduct = await this.get(productId);
    if (!currentProduct.success || !currentProduct.data) {
      return {
        data: [],
        success: false,
        error: currentProduct.error,
        meta: { cached: false, source: "error", duration: 0 },
      };
    }

    // Find similar products by category and tags
    const recommendations = await this.getProducts({
      category: currentProduct.data.category,
      status: "active",
      limit: limit * 2, // Get more to filter out current product
    });

    if (recommendations.success && recommendations.data) {
      // Filter out current product and limit results
      const filtered = recommendations.data
        .filter((p) => p._id !== productId)
        .slice(0, limit);

      // Cache for 1 hour
      await cacheService.set(cacheKey, filtered, 3600);

      return {
        data: filtered,
        success: true,
        meta: { cached: false, source: "api", duration: 0 },
      };
    }

    return recommendations;
  }

  /**
   * Check product availability
   */
  async checkAvailability(
    productId: string,
    variantId?: string,
    quantity: number = 1
  ) {
    const product = await this.get(productId);

    if (!product.success || !product.data) {
      return {
        available: false,
        reason: "Product not found",
        maxQuantity: 0,
      };
    }

    const productData = product.data;

    // Check if product is active
    if (productData.status !== "active") {
      return {
        available: false,
        reason: "Product is not available",
        maxQuantity: 0,
      };
    }

    let inventory = productData.inventory;

    // Check variant inventory if specified
    if (variantId && productData.variants) {
      const variant = productData.variants.find((v) => v._id === variantId);
      if (!variant) {
        return {
          available: false,
          reason: "Variant not found",
          maxQuantity: 0,
        };
      }
      inventory = variant.inventory;
    }

    // Check if tracking quantity
    if (!inventory.trackQuantity) {
      return {
        available: true,
        reason: "Quantity not tracked",
        maxQuantity: Infinity,
      };
    }

    // Check available quantity
    if (inventory.quantity < quantity) {
      return {
        available: false,
        reason: "Insufficient stock",
        maxQuantity: inventory.quantity,
      };
    }

    return {
      available: true,
      reason: "In stock",
      maxQuantity: inventory.quantity,
    };
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts() {
    // This would typically be handled by a backend endpoint
    // For now, we'll get all products and filter client-side (not ideal for production)
    const allProducts = await this.getProducts({
      status: "active",
      limit: 1000,
    });

    if (!allProducts.success || !allProducts.data) {
      return allProducts;
    }

    const lowStockProducts = allProducts.data.filter((product) => {
      if (!product.inventory.trackQuantity) return false;
      return (
        product.inventory.quantity <=
        (product.inventory.lowStockThreshold || 10)
      );
    });

    return {
      data: lowStockProducts,
      success: true,
      meta: { cached: false, source: "filtered", duration: 0 },
    };
  }

  // Override validation methods
  protected async validateCreate(data: Partial<Product>): Promise<void> {
    const result = validator.validateWithSchema(data, productSchema);

    if (!result.isValid) {
      throw new ValidationError(
        "Product validation failed",
        undefined,
        result.errors.map((e) => e.message)
      );
    }

    // Additional business logic validation
    await this.validateBusinessRules(data as CreateProductData);
  }

  protected async validateUpdate(
    id: string,
    data: Partial<Product>
  ): Promise<void> {
    // For updates, make schema optional
    const updateSchema = productSchema.partial();
    const result = validator.validateWithSchema(data, updateSchema);

    if (!result.isValid) {
      throw new ValidationError(
        "Product validation failed",
        undefined,
        result.errors.map((e) => e.message)
      );
    }

    // Additional business logic validation
    if (Object.keys(data).length > 0) {
      await this.validateBusinessRules(data as Partial<CreateProductData>);
    }
  }

  private async validateBusinessRules(
    data: Partial<CreateProductData>
  ): Promise<void> {
    const errors: string[] = [];

    // Validate SKU uniqueness (this would typically be done by backend)
    if (data.sku) {
      // In a real implementation, you'd check against the database
      // For now, we'll skip this validation
    }

    // Validate sale price is less than regular price
    if (data.salePrice && data.price && data.salePrice >= data.price) {
      errors.push("Sale price must be less than regular price");
    }

    // Validate category and brand exist (this would typically be done by backend)
    // For now, we'll skip this validation

    if (errors.length > 0) {
      throw new ValidationError(
        "Business rule validation failed",
        undefined,
        errors
      );
    }
  }
}

// Export singleton instance
export const productService = new ProductService();
