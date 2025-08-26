/**
 * Enterprise HTTP Client
 * Centralized HTTP client with error handling, retries, and interceptors
 */

import { envConfig } from "@/config";
import {
  BaseError,
  NetworkError,
  ServerError,
  AuthenticationError,
  ErrorCode,
  ErrorContext,
} from "@/lib/errors/types";
import {
  handleError,
  createErrorFromResponse,
} from "@/lib/errors/error-handler";

export interface RequestConfig extends RequestInit {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  requireAuth?: boolean;
  skipErrorHandling?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

export interface ResponseInterceptor {
  (response: Response): Response | Promise<Response>;
}

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number = 30000;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseUrl?: string) {
    // Base URL should NOT include API version - it will be added in buildFullUrl
    this.baseUrl = baseUrl || envConfig.NEXT_PUBLIC_API_END_POINT;
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Main request method
   */
  async request<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Apply request interceptors
      let finalConfig = { ...config };
      for (const interceptor of this.requestInterceptors) {
        finalConfig = await interceptor(finalConfig);
      }

      const response = await this.executeRequest(url, finalConfig, requestId);

      // Apply response interceptors
      let finalResponse = response;
      for (const interceptor of this.responseInterceptors) {
        finalResponse = await interceptor(finalResponse);
      }

      const data = await this.parseResponse<T>(finalResponse);

      this.logRequest(
        url,
        finalConfig,
        finalResponse,
        Date.now() - startTime,
        requestId
      );

      return data;
    } catch (error) {
      // Ensure we have a safe config reference in the catch scope
      const safeConfig = (
        typeof config === "object" ? config : {}
      ) as RequestConfig;

      const context: ErrorContext = {
        requestId,
        url: this.buildFullUrl(url, safeConfig),
        method: safeConfig.method || "GET",
        timestamp: new Date().toISOString(),
        additionalData: {
          duration: Date.now() - startTime,
          config: this.sanitizeConfig(safeConfig),
        },
      };

      if (!safeConfig.skipErrorHandling) {
        const processedError = handleError(error as Error, context);
        throw processedError;
      }

      throw error;
    }
  }

  /**
   * Execute HTTP request with retries
   */
  private async executeRequest(
    url: string,
    config: RequestConfig,
    requestId: string
  ): Promise<Response> {
    const fullUrl = this.buildFullUrl(url, config);
    const timeout = config.timeout || this.defaultTimeout;
    const retries = config.retries || 0;
    const retryDelay = config.retryDelay || 1000;

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(fullUrl, {
          ...config,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-Request-ID": requestId,
            ...config.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = createErrorFromResponse(response, {
            requestId,
            url: fullUrl,
            method: config.method || "GET",
          });

          // Don't retry client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw error;
          }

          // Retry server errors (5xx) and network errors
          if (attempt < retries) {
            await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
            continue;
          }

          throw error;
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof DOMException && error.name === "AbortError") {
          throw new NetworkError("Request timeout", {
            requestId,
            url: fullUrl,
            method: config.method || "GET",
            timestamp: new Date().toISOString(),
          });
        }

        if (attempt < retries && this.isRetryableError(error as Error)) {
          await this.delay(retryDelay * Math.pow(2, attempt));
          continue;
        }

        throw error;
      }
    }

    throw lastError!;
  }

  /**
   * Parse response data
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    }

    const text = await response.text();
    return { success: true, data: text as T };
  }

  /**
   * Build full URL
   */
  private buildFullUrl(url: string, config: RequestConfig): string {
    const baseUrl = config.baseUrl || this.baseUrl;

    // If URL is already a full HTTP URL, return as is
    if (url.startsWith("http")) {
      return url;
    }

    // Check if baseUrl already contains API version to avoid duplication
    const baseUrlHasApiVersion = baseUrl.includes(
      `/api/${envConfig.NEXT_PUBLIC_API_VERSION}`
    );

    // If URL starts with /api/, remove the /api part to avoid duplication
    if (url.startsWith("/api/")) {
      const pathWithoutApi = url.replace(/^\/api\/v?\d*\/?/, "/");

      if (baseUrlHasApiVersion) {
        // Base URL already has API version, just append the path
        return `${baseUrl}${pathWithoutApi}`;
      } else {
        // Base URL doesn't have API version, add it
        return `${baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${pathWithoutApi}`;
      }
    }

    // For all other relative paths
    const apiPath = url.startsWith("/") ? url : `/${url}`;

    if (baseUrlHasApiVersion) {
      // Base URL already has API version, just append the path
      return `${baseUrl}${apiPath}`;
    } else {
      // Base URL doesn't have API version, add it
      return `${baseUrl}/api/${envConfig.NEXT_PUBLIC_API_VERSION}${apiPath}`;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: Error): boolean {
    if (error instanceof BaseError) {
      return error.retryable;
    }

    // Network errors are generally retryable
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("timeout")
    );
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log request details
   */
  private logRequest(
    url: string,
    config: RequestConfig,
    response: Response,
    duration: number,
    requestId: string
  ): void {
    if (process.env.NODE_ENV === "development") {
      console.log(`🌐 ${config.method || "GET"} ${url}`, {
        requestId,
        status: response.status,
        duration: `${duration}ms`,
        headers: Object.fromEntries(response.headers.entries()),
      });
    }
  }

  /**
   * Sanitize config for logging (remove sensitive data)
   */
  private sanitizeConfig(config: RequestConfig): Partial<RequestConfig> {
    const { headers, ...rest } = config;
    return {
      ...rest,
      headers: headers
        ? this.sanitizeHeaders(headers as Record<string, string>)
        : undefined,
    };
  }

  /**
   * Sanitize headers (remove sensitive information)
   */
  private sanitizeHeaders(
    headers: Record<string, string>
  ): Record<string, string> {
    const sanitized = { ...headers };
    const sensitiveKeys = ["authorization", "cookie", "x-api-key"];

    sensitiveKeys.forEach((key) => {
      if (sanitized[key]) {
        sanitized[key] = "[REDACTED]";
      }
    });

    return sanitized;
  }

  // Convenience methods
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}

// Create default instance
export const httpClient = new HttpClient();

// Export for custom instances
export { HttpClient };

// Attach Authorization header if token exists in localStorage
try {
  httpClient.addRequestInterceptor((config) => {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = window.localStorage.getItem("auth_token");
      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        } as Record<string, string>;
      }
    }
    return config;
  });
} catch (_) {
  // ignore if not in browser
}
