/**
 * User Service
 * Enterprise-level user management service with profile and address management
 */

import { BaseService } from "@/lib/api/base-service";
import { httpClient } from "@/lib/api/http-client";
import { API_CONFIG } from "@/lib/api-config";
import { cacheService } from "@/lib/cache/cache-service";
import { validator, commonSchemas } from "@/lib/validation/validator";
import { ValidationError } from "@/lib/errors/types";
import { z } from "zod";
import { User, Address } from "@/lib/auth/auth-service";

// Extended user types for service layer
export interface UserProfile extends User {
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: "public" | "private";
      showEmail: boolean;
      showPhone: boolean;
    };
  };
  statistics: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    loyaltyPoints: number;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
  preferences?: Partial<UserProfile["preferences"]>;
}

export interface CreateAddressData {
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long")
    .optional(),
  phone: commonSchemas.phone.optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  avatar: commonSchemas.url.optional(),
  preferences: z
    .object({
      language: z.string().min(2, "Invalid language code").optional(),
      currency: z.string().length(3, "Invalid currency code").optional(),
      timezone: z.string().min(1, "Invalid timezone").optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
          push: z.boolean().optional(),
          marketing: z.boolean().optional(),
        })
        .optional(),
      privacy: z
        .object({
          profileVisibility: z.enum(["public", "private"]).optional(),
          showEmail: z.boolean().optional(),
          showPhone: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

const createAddressSchema = z.object({
  type: z.enum(["home", "work", "other"]),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  company: z.string().max(100, "Company name too long").optional(),
  street: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address too long"),
  street2: z.string().max(200, "Street address 2 too long").optional(),
  city: z.string().min(1, "City is required").max(100, "City name too long"),
  state: z.string().min(1, "State is required").max(100, "State name too long"),
  zipCode: z
    .string()
    .min(1, "ZIP code is required")
    .max(20, "ZIP code too long"),
  country: z
    .string()
    .min(2, "Country is required")
    .max(2, "Invalid country code"),
  phone: commonSchemas.phone.optional(),
  isDefault: z.boolean().optional(),
});

class UserService extends BaseService<UserProfile> {
  private http = httpClient;
  constructor() {
    super("users", {
      baseUrl: API_CONFIG.USERS.PROFILE.replace("/profile", ""),
      cacheService,
      enableAudit: true,
      defaultCacheTtl: 300,
    });
  }

  /**
   * Get current user profile
   */
  async getCurrentProfile() {
    const cacheKey = "current-user-profile";

    // Try cache first
    const cached = await cacheService.get<UserProfile>(cacheKey);
    if (cached) {
      return {
        data: cached,
        success: true,
        meta: { cached: true, source: "cache", duration: 0 },
      };
    }

    const result = await this.http.get<UserProfile>(API_CONFIG.USERS.PROFILE);

    // Cache user profile for 5 minutes
    if (result.success && result.data) {
      await cacheService.set(cacheKey, result.data, 300);
    }

    return {
      data: result.data,
      success: result.success,
      error: result.success ? undefined : new Error("Failed to get profile"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData) {
    // Validate input
    const validationResult = validator.validateWithSchema(
      data,
      updateProfileSchema
    );
    if (!validationResult.isValid) {
      throw new ValidationError(
        "Profile validation failed",
        undefined,
        validationResult.errors.map((e) => e.message)
      );
    }

    const result = await this.http.put<UserProfile>(
      API_CONFIG.USERS.PROFILE,
      data
    );

    // Invalidate cache
    if (result.success) {
      await cacheService.delete("current-user-profile");
      await this.invalidateUserCaches();
    }

    return {
      data: result.data,
      success: result.success,
      error: result.success ? undefined : new Error("Failed to update profile"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  /**
   * Get user addresses
   */
  async getAddresses() {
    const cacheKey = "user-addresses";

    // Try cache first
    const cached = await cacheService.get<Address[]>(cacheKey);
    if (cached) {
      return {
        data: cached,
        success: true,
        meta: { cached: true, source: "cache", duration: 0 },
      };
    }

    const result = await this.http.get<Address[]>(API_CONFIG.USERS.ADDRESSES);

    // Cache addresses for 10 minutes
    if (result.success && result.data) {
      await cacheService.set(cacheKey, result.data, 600);
    }

    return {
      data: result.data || [],
      success: result.success,
      error: result.success ? undefined : new Error("Failed to get addresses"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  /**
   * Add new address
   */
  async addAddress(data: CreateAddressData) {
    // Validate input
    const validationResult = validator.validateWithSchema(
      data,
      createAddressSchema
    );
    if (!validationResult.isValid) {
      throw new ValidationError(
        "Address validation failed",
        undefined,
        validationResult.errors.map((e) => e.message)
      );
    }

    const result = await this.http.post<Address>(
      API_CONFIG.USERS.ADDRESSES,
      data
    );

    // Invalidate addresses cache
    if (result.success) {
      await cacheService.delete("user-addresses");
    }

    return {
      data: result.data,
      success: result.success,
      error: result.success ? undefined : new Error("Failed to add address"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  /**
   * Update address
   */
  async updateAddress(addressId: string, data: Partial<CreateAddressData>) {
    // Validate input
    const updateAddressSchema = createAddressSchema.partial();
    const validationResult = validator.validateWithSchema(
      data,
      updateAddressSchema
    );
    if (!validationResult.isValid) {
      throw new ValidationError(
        "Address validation failed",
        undefined,
        validationResult.errors.map((e) => e.message)
      );
    }

    const result = await this.http.put<Address>(
      API_CONFIG.USERS.ADDRESS_BY_ID.replace(":addressId", addressId),
      data
    );

    // Invalidate addresses cache
    if (result.success) {
      await cacheService.delete("user-addresses");
    }

    return {
      data: result.data,
      success: result.success,
      error: result.success ? undefined : new Error("Failed to update address"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string) {
    const result = await this.http.delete(
      API_CONFIG.USERS.ADDRESS_BY_ID.replace(":addressId", addressId)
    );

    // Invalidate addresses cache
    if (result.success) {
      await cacheService.delete("user-addresses");
    }

    return {
      data: result.success,
      success: result.success,
      error: result.success ? undefined : new Error("Failed to delete address"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  /**
   * Set default address
   */
  async setDefaultAddress(addressId: string) {
    const result = await this.http.put(
      API_CONFIG.USERS.SET_DEFAULT_ADDRESS.replace(":addressId", addressId),
      {}
    );

    // Invalidate addresses cache
    if (result.success) {
      await cacheService.delete("user-addresses");
    }

    return {
      data: result.success,
      success: result.success,
      error: result.success
        ? undefined
        : new Error("Failed to set default address"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  /**
   * Get user order history
   */
  async getOrderHistory(page: number = 1, limit: number = 10) {
    const cacheKey = `user-orders:${page}:${limit}`;

    // Try cache first
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) {
      return {
        data: cached,
        success: true,
        meta: { cached: true, source: "cache", duration: 0 },
      };
    }

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    const result = await this.http.get<any[]>(
      `${API_CONFIG.ORDERS.USER_ORDERS}?${params.toString()}`
    );

    // Cache order history for 5 minutes
    if (result.success && result.data) {
      await cacheService.set(cacheKey, result.data, 300);
    }

    return {
      data: result.data || [],
      success: result.success,
      error: result.success
        ? undefined
        : new Error("Failed to get order history"),
      meta: { cached: false, source: "api", duration: 0 },
    };
  }

  // Note: wishlist/statistics endpoints are not present in backend; removed.

  /**
   * Invalidate all user-related caches
   */
  private async invalidateUserCaches() {
    const cacheKeys = [
      "current-user-profile",
      "user-addresses",
      "user-wishlist",
      "user-statistics",
    ];

    await Promise.all(cacheKeys.map((key) => cacheService.delete(key)));

    // Also invalidate paginated order history (simplified approach)
    // In a real implementation, you'd maintain a more sophisticated cache invalidation strategy
    for (let page = 1; page <= 10; page++) {
      for (const limit of [10, 20, 50]) {
        await cacheService.delete(`user-orders:${page}:${limit}`);
      }
    }
  }
}

// Export singleton instance
export const userService = new UserService();
