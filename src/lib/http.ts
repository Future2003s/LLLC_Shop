import { envConfig } from "@/config";

// Enhanced error handling
export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly payload: any;
  public readonly url: string;

  constructor({
    statusCode,
    payload,
    url,
  }: {
    statusCode: number;
    payload: any;
    url: string;
  }) {
    super(`HTTP Error ${statusCode}: ${payload?.message || "Request failed"}`);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.payload = payload;
    this.url = url;
  }
}

// Request interceptor type
export type RequestInterceptor = (config: RequestConfig) => RequestConfig;
export type ResponseInterceptor = (
  response: Response,
  config: RequestConfig
) => Response;

// Request configuration
export interface RequestConfig extends RequestInit {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Enhanced request function with better error handling
const request = async (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: RequestConfig
) => {
  const body: string | undefined = options?.body
    ? JSON.stringify(options.body)
    : undefined;

  const baseHeaders = {
    "Content-Type": "application/json; charset=utf-8",
  };

  // Determine base URL
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_END_POINT ||
        `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}`
      : options.baseUrl;

  // Support absolute URLs without prefixing baseUrl
  const isAbsolute = url.startsWith("http://") || url.startsWith("https://");
  const fullUrl = isAbsolute
    ? url
    : url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  console.log(`🌐 API Request: ${method} ${fullUrl}`);

  // Add timeout support
  const controller = new AbortController();
  const timeoutId = options?.timeout
    ? setTimeout(() => controller.abort(), options.timeout)
    : null;

  try {
    const res = await fetch(fullUrl, {
      headers: {
        ...baseHeaders,
        ...options?.headers,
      },
      body,
      method,
      signal: controller.signal,
    });

    // Clear timeout
    if (timeoutId) clearTimeout(timeoutId);

    // Parse response
    let data;
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } else {
        data = null;
      }
    } catch (error) {
      console.error("JSON parse error:", error);
      data = null;
    }

    // Handle non-2xx responses
    if (!res.ok) {
      throw new HttpError({
        statusCode: res.status,
        payload: data || { message: `HTTP ${res.status}: ${res.statusText}` },
        url: fullUrl,
      });
    }

    return data;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);

    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new HttpError({
        statusCode: 408,
        payload: { message: "Request timeout" },
        url: fullUrl,
      });
    }

    throw new HttpError({
      statusCode: 0,
      payload: {
        message: error instanceof Error ? error.message : "Network error",
      },
      url: fullUrl,
    });
  }
};

// Retry mechanism
const requestWithRetry = async (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: RequestConfig
) => {
  const maxRetries = options?.retries || 0;
  const retryDelay = options?.retryDelay || 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await request(method, url, options);
    } catch (error) {
      if (
        error instanceof HttpError &&
        error.statusCode >= 500 &&
        attempt < maxRetries
      ) {
        console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries} for ${url}`);
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1))
        );
        continue;
      }
      throw error;
    }
  }
};

export const http = {
  get(url: string, options?: Omit<RequestConfig, "body">) {
    return requestWithRetry("GET", url, options);
  },

  post<TypeRequestBody>(
    url: string,
    body: any,
    options?: Omit<RequestConfig, "body">
  ) {
    return requestWithRetry("POST", url, { ...options, body });
  },

  put(url: string, body: any, options?: Omit<RequestConfig, "body">) {
    return requestWithRetry("PUT", url, { ...options, body });
  },

  patch(url: string, body: any, options?: Omit<RequestConfig, "body">) {
    return requestWithRetry("PATCH", url, { ...options, body });
  },

  delete(url: string, options?: Omit<RequestConfig, "body">) {
    return requestWithRetry("DELETE", url, options);
  },
};
