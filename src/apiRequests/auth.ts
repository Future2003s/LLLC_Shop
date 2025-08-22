import {
  LoginBodyType,
  ExtendedLoginBodyType,
  RegisterRequestType,
} from "@/shemaValidation/auth.schema";
import { http, HttpError } from "@/lib/http";
import {
  API_CONFIG,
  buildApiUrl,
  getAuthHeaders,
  buildFullUrl,
} from "@/lib/api-config";

// Backend response types - matching exactly with Node.js backend
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
      preferences?: {
        language: string;
        currency: string;
        notifications: {
          email: boolean;
          sms: boolean;
          push: boolean;
        };
      };
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

// Enhanced API calls with better error handling and exact backend integration
export const authApiRequest = {
  // Register new user
  register: async (body: RegisterRequestType): Promise<BackendAuthResponse> => {
    try {
      const response = await http.post(API_CONFIG.AUTH.REGISTER, body, {
        timeout: 10000, // 10 seconds timeout
        retries: 1,
      });
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Registration failed" },
        url: buildApiUrl(API_CONFIG.AUTH.REGISTER),
      });
    }
  },

  // Login user
  login: async (
    body: LoginBodyType | ExtendedLoginBodyType
  ): Promise<BackendAuthResponse> => {
    try {
      const response = await http.post(API_CONFIG.AUTH.LOGIN, body, {
        timeout: 10000,
        retries: 1,
      });
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Login failed" },
        url: buildApiUrl(API_CONFIG.AUTH.LOGIN),
      });
    }
  },

  // Enhanced login with extended data
  loginExtended: async (
    body: ExtendedLoginBodyType
  ): Promise<BackendAuthResponse> => {
    try {
      const response = await http.post(API_CONFIG.AUTH.LOGIN, body, {
        timeout: 10000,
        retries: 1,
      });
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Login failed" },
        url: buildApiUrl(API_CONFIG.AUTH.LOGIN),
      });
    }
  },

  // Get current user profile
  me: async (
    token: string
  ): Promise<{ success: boolean; data: BackendUserProfile }> => {
    try {
      const response = await http.get(API_CONFIG.AUTH.ME, {
        headers: getAuthHeaders(token),
        timeout: 8000,
        retries: 1,
      });
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Failed to get user profile" },
        url: buildApiUrl(API_CONFIG.AUTH.ME),
      });
    }
  },

  // Change password
  changePassword: async (
    token: string,
    body: { currentPassword: string; newPassword: string }
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await http.put(API_CONFIG.AUTH.CHANGE_PASSWORD, body, {
        headers: getAuthHeaders(token),
        timeout: 10000,
        retries: 1,
      });
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Failed to change password" },
        url: buildApiUrl(API_CONFIG.AUTH.CHANGE_PASSWORD),
      });
    }
  },

  // Forgot password
  forgotPassword: async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await http.post(
        API_CONFIG.AUTH.FORGOT_PASSWORD,
        { email },
        {
          timeout: 10000,
          retries: 1,
        }
      );
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Failed to send reset email" },
        url: buildApiUrl(API_CONFIG.AUTH.FORGOT_PASSWORD),
      });
    }
  },

  // Reset password with token
  resetPassword: async (
    token: string,
    password: string
  ): Promise<BackendAuthResponse> => {
    try {
      const url = buildApiUrl(API_CONFIG.AUTH.RESET_PASSWORD, { token });
      const response = await http.put(
        url,
        { password },
        {
          timeout: 10000,
          retries: 1,
        }
      );
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Failed to reset password" },
        url: buildApiUrl(API_CONFIG.AUTH.RESET_PASSWORD, { token }),
      });
    }
  },

  // Refresh access token
  refreshToken: async (
    refreshToken: string
  ): Promise<{
    success: boolean;
    data: { token: string; refreshToken: string };
  }> => {
    try {
      const response = await http.post(
        API_CONFIG.AUTH.REFRESH_TOKEN,
        { refreshToken },
        {
          timeout: 8000,
          retries: 1,
        }
      );
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Failed to refresh token" },
        url: buildApiUrl(API_CONFIG.AUTH.REFRESH_TOKEN),
      });
    }
  },

  // Verify email with token
  verifyEmail: async (
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const url = buildApiUrl(API_CONFIG.AUTH.VERIFY_EMAIL, { token });
      const response = await http.get(url, {
        timeout: 8000,
        retries: 1,
      });
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Failed to verify email" },
        url: buildApiUrl(API_CONFIG.AUTH.VERIFY_EMAIL, { token }),
      });
    }
  },

  // Logout user
  logout: async (
    token?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const headers = token ? getAuthHeaders(token) : {};
      const response = await http.post(
        API_CONFIG.AUTH.LOGOUT,
        {},
        {
          headers,
          timeout: 5000,
          retries: 0,
        }
      );
      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Failed to logout" },
        url: buildApiUrl(API_CONFIG.AUTH.LOGOUT),
      });
    }
  },
};
