import { http, HttpError } from "@/lib/http";
import {
  API_CONFIG,
  buildApiUrl,
  getAuthHeaders,
  buildFullUrl,
} from "@/lib/api-config";

// Base API Service class
export class ApiService {
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_CONFIG.API_BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
    };
  }

  // Generic GET request
  protected async get<T>(
    endpoint: string,
    params?: Record<string, string | number>,
    queryParams?: Record<string, any>,
    options?: {
      token?: string;
      timeout?: number;
      retries?: number;
    }
  ): Promise<T> {
    try {
      const url = buildFullUrl(endpoint, params, queryParams);
      const headers = options?.token
        ? { ...this.defaultHeaders, ...getAuthHeaders(options.token) }
        : this.defaultHeaders;

      const response = await http.get(url, {
        headers,
        timeout: options?.timeout || 8000,
        retries: options?.retries || 1,
      });

      return response;
    } catch (error) {
      this.handleError(error, endpoint);
    }
  }

  // Generic POST request
  protected async post<T>(
    endpoint: string,
    body: any,
    params?: Record<string, string | number>,
    options?: {
      token?: string;
      timeout?: number;
      retries?: number;
    }
  ): Promise<T> {
    try {
      const url = buildApiUrl(endpoint, params);
      const headers = options?.token
        ? { ...this.defaultHeaders, ...getAuthHeaders(options.token) }
        : this.defaultHeaders;

      const response = await http.post(url, body, {
        headers,
        timeout: options?.timeout || 10000,
        retries: options?.retries || 1,
      });

      return response;
    } catch (error) {
      this.handleError(error, endpoint);
    }
  }

  // Generic PUT request
  protected async put<T>(
    endpoint: string,
    body: any,
    params?: Record<string, string | number>,
    options?: {
      token?: string;
      timeout?: number;
      retries?: number;
    }
  ): Promise<T> {
    try {
      const url = buildApiUrl(endpoint, params);
      const headers = options?.token
        ? { ...this.defaultHeaders, ...getAuthHeaders(options.token) }
        : this.defaultHeaders;

      const response = await http.put(url, body, {
        headers,
        timeout: options?.timeout || 10000,
        retries: options?.retries || 1,
      });

      return response;
    } catch (error) {
      this.handleError(error, endpoint);
    }
  }

  // Generic PATCH request
  protected async patch<T>(
    endpoint: string,
    body: any,
    params?: Record<string, string | number>,
    options?: {
      token?: string;
      timeout?: number;
      retries?: number;
    }
  ): Promise<T> {
    try {
      const url = buildApiUrl(endpoint, params);
      const headers = options?.token
        ? { ...this.defaultHeaders, ...getAuthHeaders(options.token) }
        : this.defaultHeaders;

      const response = await http.patch(url, body, {
        headers,
        timeout: options?.timeout || 10000,
        retries: options?.retries || 1,
      });

      return response;
    } catch (error) {
      this.handleError(error, endpoint);
    }
  }

  // Generic DELETE request
  protected async delete<T>(
    endpoint: string,
    params?: Record<string, string | number>,
    options?: {
      token?: string;
      timeout?: number;
      retries?: number;
    }
  ): Promise<T> {
    try {
      const url = buildApiUrl(endpoint, params);
      const headers = options?.token
        ? { ...this.defaultHeaders, ...getAuthHeaders(options.token) }
        : this.defaultHeaders;

      const response = await http.delete(url, {
        headers,
        timeout: options?.timeout || 8000,
        retries: options?.retries || 1,
      });

      return response;
    } catch (error) {
      this.handleError(error, endpoint);
    }
  }

  // Error handling
  private handleError(error: any, endpoint: string): never {
    if (error instanceof HttpError) {
      throw error;
    }

    // Log error for debugging
    console.error(`API Error in ${endpoint}:`, error);

    // Throw standardized error
    throw new HttpError({
      statusCode: 0,
      payload: {
        message: error?.message || "API request failed",
        endpoint,
        timestamp: new Date().toISOString(),
      },
      url: buildApiUrl(endpoint),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await http.get(`${API_CONFIG.BACKEND_BASE_URL}/health`, {
        timeout: 5000,
        retries: 0,
      });
      return response;
    } catch (error) {
      throw new HttpError({
        statusCode: 0,
        payload: { message: "Backend health check failed" },
        url: `${API_CONFIG.BACKEND_BASE_URL}/health`,
      });
    }
  }

  // Test API endpoint
  async testApi(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await http.get(API_CONFIG.API_BASE_URL + "/test", {
        timeout: 5000,
        retries: 0,
      });
      return response;
    } catch (error) {
      throw new HttpError({
        statusCode: 0,
        payload: { message: "API test failed" },
        url: API_CONFIG.API_BASE_URL + "/test",
      });
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
