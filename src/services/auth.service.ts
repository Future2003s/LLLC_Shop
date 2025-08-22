import { ApiService } from "./api.service";
import { API_CONFIG } from "@/lib/api-config";
import {
  LoginBodyType,
  ExtendedLoginBodyType,
  RegisterRequestType,
} from "@/shemaValidation/auth.schema";

// Backend response types - matching exactly with Node.js backend from API_DOCUMENTATION.md
export interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      avatar?: string;
      isActive: boolean;
      isEmailVerified: boolean;
      lastLogin?: string;
      phone?: string; // Optional field from backend
    };
    token: string;
    refreshToken: string;
    expiresIn?: number;
    permissions?: string[];
  };
}

export interface BackendUserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  addresses: any[];
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

// Auth Service extending ApiService
export class AuthService extends ApiService {
  // Register new user - sử dụng endpoint /auth/register từ API_DOCUMENTATION.md
  async register(body: RegisterRequestType): Promise<BackendAuthResponse> {
    return this.post<BackendAuthResponse>(
      API_CONFIG.AUTH.REGISTER,
      body,
      undefined,
      { timeout: 15000, retries: 2 }
    );
  }

  // Login user - sử dụng endpoint /auth/login từ API_DOCUMENTATION.md
  async login(
    body: LoginBodyType | ExtendedLoginBodyType
  ): Promise<BackendAuthResponse> {
    return this.post<BackendAuthResponse>(
      API_CONFIG.AUTH.LOGIN,
      body,
      undefined,
      { timeout: 15000, retries: 2 }
    );
  }

  // Enhanced login with extended data
  async loginExtended(
    body: ExtendedLoginBodyType
  ): Promise<BackendAuthResponse> {
    return this.post<BackendAuthResponse>(
      API_CONFIG.AUTH.LOGIN,
      body,
      undefined,
      { timeout: 15000, retries: 2 }
    );
  }

  // Get current user profile - sử dụng endpoint /auth/me từ API_DOCUMENTATION.md
  async getCurrentUser(
    token: string
  ): Promise<{ success: boolean; data: BackendUserProfile }> {
    return this.get<{ success: boolean; data: BackendUserProfile }>(
      API_CONFIG.AUTH.ME,
      undefined,
      undefined,
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Change password - sử dụng endpoint /auth/change-password từ API_DOCUMENTATION.md
  async changePassword(
    token: string,
    body: { currentPassword: string; newPassword: string }
  ): Promise<{ success: boolean; message: string }> {
    return this.put<{ success: boolean; message: string }>(
      API_CONFIG.AUTH.CHANGE_PASSWORD,
      body,
      undefined,
      { token, timeout: 15000, retries: 1 }
    );
  }

  // Forgot password - sử dụng endpoint /auth/forgot-password từ API_DOCUMENTATION.md
  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    return this.post<{ success: boolean; message: string }>(
      API_CONFIG.AUTH.FORGOT_PASSWORD,
      { email },
      undefined,
      { timeout: 15000, retries: 2 }
    );
  }

  // Reset password with token - sử dụng endpoint /auth/reset-password/:token từ API_DOCUMENTATION.md
  async resetPassword(
    token: string,
    password: string
  ): Promise<BackendAuthResponse> {
    return this.put<BackendAuthResponse>(
      API_CONFIG.AUTH.RESET_PASSWORD,
      { password },
      { token },
      { timeout: 15000, retries: 2 }
    );
  }

  // Refresh access token - sử dụng endpoint /auth/refresh-token từ API_DOCUMENTATION.md
  async refreshToken(refreshToken: string): Promise<{
    success: boolean;
    data: { token: string; refreshToken: string };
  }> {
    return this.post<{
      success: boolean;
      data: { token: string; refreshToken: string };
    }>(API_CONFIG.AUTH.REFRESH_TOKEN, { refreshToken }, undefined, {
      timeout: 10000,
      retries: 1,
    });
  }

  // Verify email with token - sử dụng endpoint /auth/verify-email/:token từ API_DOCUMENTATION.md
  async verifyEmail(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return this.get<{ success: boolean; message: string }>(
      API_CONFIG.AUTH.VERIFY_EMAIL,
      { token },
      undefined,
      { token: undefined, timeout: 10000, retries: 1 }
    );
  }

  // Logout user - sử dụng endpoint /auth/logout từ API_DOCUMENTATION.md
  async logout(token?: string): Promise<{ success: boolean; message: string }> {
    return this.post<{ success: boolean; message: string }>(
      API_CONFIG.AUTH.LOGOUT,
      {},
      undefined,
      { token, timeout: 8000, retries: 0 }
    );
  }

  // Validate token (optional method for token validation)
  async validateToken(
    token: string
  ): Promise<{ valid: boolean; user?: BackendUserProfile }> {
    try {
      const response = await this.getCurrentUser(token);
      return { valid: true, user: response.data };
    } catch (error) {
      return { valid: false };
    }
  }

  // Get user profile - sử dụng endpoint /users/profile từ API_DOCUMENTATION.md
  async getUserProfile(token: string): Promise<{
    success: boolean;
    data: BackendUserProfile;
  }> {
    return this.get<{
      success: boolean;
      data: BackendUserProfile;
    }>(API_CONFIG.USERS.PROFILE, undefined, undefined, {
      token,
      timeout: 8000,
      retries: 1,
    });
  }

  // Update user profile - sử dụng endpoint /users/profile từ API_DOCUMENTATION.md
  async updateUserProfile(
    token: string,
    profileData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    return this.put<{ success: boolean; message: string }>(
      API_CONFIG.USERS.PROFILE,
      profileData,
      undefined,
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Get user addresses - sử dụng endpoint /users/addresses từ API_DOCUMENTATION.md
  async getUserAddresses(token: string): Promise<{
    success: boolean;
    data: any[];
  }> {
    return this.get<{
      success: boolean;
      data: any[];
    }>(API_CONFIG.USERS.ADDRESSES, undefined, undefined, {
      token,
      timeout: 8000,
      retries: 1,
    });
  }

  // Add address - sử dụng endpoint /users/addresses từ API_DOCUMENTATION.md
  async addAddress(
    token: string,
    addressData: {
      type: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault: boolean;
    }
  ): Promise<{ success: boolean; message: string; data?: any }> {
    return this.post<{ success: boolean; message: string; data?: any }>(
      API_CONFIG.USERS.ADDRESSES,
      addressData,
      undefined,
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Update address - sử dụng endpoint /users/addresses/:addressId từ API_DOCUMENTATION.md
  async updateAddress(
    token: string,
    addressId: string,
    addressData: any
  ): Promise<{ success: boolean; message: string }> {
    return this.put<{ success: boolean; message: string }>(
      API_CONFIG.USERS.ADDRESS_BY_ID,
      addressData,
      { addressId },
      { token, timeout: 10000, retries: 1 }
    );
  }

  // Delete address - sử dụng endpoint /users/addresses/:addressId từ API_DOCUMENTATION.md
  async deleteAddress(
    token: string,
    addressId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(
      API_CONFIG.USERS.ADDRESS_BY_ID,
      { addressId },
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Set default address - sử dụng endpoint /users/addresses/:addressId/default từ API_DOCUMENTATION.md
  async setDefaultAddress(
    token: string,
    addressId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.put<{ success: boolean; message: string }>(
      API_CONFIG.USERS.SET_DEFAULT_ADDRESS,
      {},
      { addressId },
      { token, timeout: 8000, retries: 1 }
    );
  }

  // Test connection to backend - sử dụng endpoint /health từ API_DOCUMENTATION.md
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.get(API_CONFIG.HEALTH, undefined, undefined, {
        timeout: 5000,
        retries: 0,
      });
      return { success: true, message: "Backend connection successful" };
    } catch (error) {
      return { success: false, message: "Backend connection failed" };
    }
  }

  // Test API endpoint - sử dụng endpoint /test từ API_DOCUMENTATION.md
  async testApi(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.get(API_CONFIG.TEST, undefined, undefined, {
        timeout: 5000,
        retries: 0,
      });
      return { success: true, message: "API test successful" };
    } catch (error) {
      return { success: false, message: "API test failed" };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
